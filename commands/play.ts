import { SlashCommandBuilder } from '@discordjs/builders';
import {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} from '@discordjs/voice';
import { ChatInputCommandInteraction } from 'discord.js';
import ytdl from 'ytdl-core-discord';
import yts from 'yt-search';
import axios from 'axios';

import { PlayingEmbed, StoppedEmbed } from '../handler/embeds';
import { VoiceStateLogger, AudioLogger } from '../handler/logger';
import { Song, SongLinkAPIResponse } from '../index';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(
            'Joins your current Voice Channel and starts playing your selected music'
        )
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('YouTube URL, Name of the Song or any other supported Link (see /supportedplatforms)')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('volume')
                .setDescription('Volume of the Song')
                .setMinValue(0.1)
                .setMaxValue(10)
        )
        .addStringOption((option) =>
            option.setName('loop').setDescription('Loop the Song')
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) return;

        if (interaction.member.voice.channel) {
            interaction.deferReply();
            const targetsong: string = interaction.options.getString('url');
            const YoutubeCheckPattern =
                /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
            const URLCheckPattern = /^(http|https):\/\/[^ "]+$/gi;
            const YoutubeCheck = YoutubeCheckPattern.test(
                interaction.options.getString('url')
            );
            let songData;
            let song: Song;
            if (YoutubeCheck) {
                songData = await ytdl.getInfo(
                    interaction.options.getString('url')
                );
            } else if (URLCheckPattern.test(interaction.options.getString('url'))) {
                let songlinkAPIResponse = await axios.get(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(interaction.options.getString('url'))}`);
                let ResponseJSONData: SongLinkAPIResponse = JSON.parse(JSON.stringify(songlinkAPIResponse.data));
                if(ResponseJSONData.linksByPlatform.youtube == undefined) {
                    interaction.editReply({
                        content: 'Sorry but I wasn\'t able to find this song on YouTube, try by using the name of the song instead of the link'
                    });
                    return;
                }
                songData = await ytdl.getInfo(ResponseJSONData.linksByPlatform.youtube.entityUniqueId.split("::")[1])
            } else  {
                const resultID = (await yts(targetsong)).videos[0].videoId;
                songData = await ytdl.getInfo(resultID);
            }
            song = {
                title: songData.videoDetails.title,
                url: songData.videoDetails.video_url,
                duration: parseFloat(songData.videoDetails.lengthSeconds),
                thumbnail: songData.videoDetails.thumbnails[3].url,
            };

            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.member.guild.id,
                adapterCreator:
                    interaction.member.voice.channel.guild.voiceAdapterCreator,
            });

            // START: WORKAROUND FOR PAUSE IN PLAY
            connection.on('stateChange', (oldState, newState) => {
                const oldNetworking = Reflect.get(oldState, 'networking');
                const newNetworking = Reflect.get(newState, 'networking');

                const networkStateChangeHandler = (
                    oldNetworkState: any,
                    newNetworkState: any
                ) => {
                    const newUdp = Reflect.get(newNetworkState, 'udp');
                    clearInterval(newUdp?.keepAliveInterval);
                };

                oldNetworking?.off('stateChange', networkStateChangeHandler);
                newNetworking?.on('stateChange', networkStateChangeHandler);
            });
            // END: WORKAROUND FOR PAUSE IN PLAY

            let stream = await ytdl(song.url, {
                highWaterMark: 1 << 25,
                filter: 'audioonly',
                quality: 'highestaudio',
            });
            const volume: number = interaction.options.getNumber('volume')
                ? interaction.options.getNumber('volume')
                : 0.5;

            const player = createAudioPlayer();
            const resource = createAudioResource(stream, {
                inputType: StreamType.Opus,
                inlineVolume: true,
            });

            resource.volume.setVolume(volume);

            connection.subscribe(player);
            player.play(resource);

            // Execute the VoiceStateLogger to log the current state of the player when DevMode is true
            if (process.env.DEV_MODE === 'true') {
                VoiceStateLogger(connection, player);
            }

            if (song) {
                AudioLogger('Play', interaction, song);
            }

            interaction.editReply({ embeds: [PlayingEmbed(song, volume)] });

            player.on(AudioPlayerStatus.Idle, () => {
                AudioLogger('AutoStop', interaction);
                interaction.followUp({ embeds: [StoppedEmbed(song)] });
                connection.destroy();
            });
        } else {
            interaction.reply({
                content: 'You need to join a Voice Channel first!',
                allowedMentions: { repliedUser: true },
            });
        }
    },
};
