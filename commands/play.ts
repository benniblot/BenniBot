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
import ytsr from 'ytsr';
import chalk from 'chalk';

import { PlayingEmbed, StoppedEmbed } from '../handler/embeds';
import { VoiceStateLogger } from '../handler/VoiceStateLogger';
import { song } from '../index';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(
            'Joins your current Voice Channel and starts playing your selected music'
        )
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('YouTube URL or Name of the Song')
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

        interaction.deferReply();
        if (interaction.member.voice.channel) {
            const targetsong: string = interaction.options.getString('url');
            const YoutubeCheckPattern =
                /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
            const YoutubeCheck = YoutubeCheckPattern.test(
                interaction.options.getString('url')
            );
            let songData;
            let song: song;
            if (YoutubeCheck) {
                try {
                    songData = await ytdl.getInfo(
                        interaction.options.getString('url')
                    );
                    song = {
                        title: songData.videoDetails.title,
                        url: songData.videoDetails.video_url,
                        duration: parseFloat(
                            songData.videoDetails.lengthSeconds
                        ),
                        thumbnail: songData.videoDetails.thumbnails[3].url,
                    };
                } catch (error) {
                    console.error(Error);
                }
            } else {
                try {
                    console.log(
                        (await ytsr(targetsong, { limit: 1 })).items[0]
                    );
                    /*const resultId: string = (
                        await ytsr(targetsong, { limit: 1 })
                    ).items[0]['url'].split('=');
                    songData = await ytdl.getInfo(resultId[1]);
                    song = {
                        title: songData.videoDetails.title,
                        url: songData.videoDetails.video_url,
                        duration: songData.videoDetails.lengthSeconds,
                        thumbnail: songData.videoDetails.thumbnails[3].url,
                    };*/
                } catch (error) {
                    console.log(error);
                }
            }

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

            // TODO: create custom log handler
            if (song) {
                console.log(
                    '[Play] ' +
                        chalk.gray(`${song.title}`) +
                        ' on ' +
                        chalk.gray(`${interaction.guild.name}`) +
                        ' by ' +
                        chalk.gray(`${interaction.member.user.username}`)
                );
            }

            interaction.editReply({ embeds: [PlayingEmbed(song, volume)] });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('[AutoStop] on "' + interaction.guild.name + '"');
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
