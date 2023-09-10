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
import { VoiceStateLogger, AudioLogger } from '../handler/logger';
import { Song } from '../index';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('benbot')
        .setDescription('BenniBots Secret')
        .addNumberOption((option) =>
            option.setName('number').setDescription('Secret Number')
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) return;

        interaction.deferReply();
        if (interaction.member.voice.channel) {
            let songData = null;
            let song: Song = null;

            songData = await ytdl.getInfo(
                'https://www.youtube.com/watch?v=-A93yVA5aLQ'
            );
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
            let stream = await ytdl(song.url, {
                highWaterMark: 1 << 25,
                filter: 'audioonly',
                quality: 'highestaudio',
            });

            const player = createAudioPlayer();
            const resource = createAudioResource(stream, {
                inputType: StreamType.Opus,
                inlineVolume: true,
            });

            resource.volume.setVolume(0.5);

            connection.subscribe(player);
            player.play(resource);

            // Execute the VoiceStateLogger to log the current state of the player when DevMode is true
            if (process.env.DEV_MODE === 'true') {
                VoiceStateLogger(connection, player);
            }

            if (song) {
                AudioLogger('Play', interaction, song);
            }

            // TODO: create Benbot Embed
            //interaction.editReply({ embeds: [PlayingEmbed(song, 0.5)] });
            interaction.editReply({ content: 'benbot' });

            player.on(AudioPlayerStatus.Idle, () => {
                AudioLogger('AutoStop', interaction);
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
