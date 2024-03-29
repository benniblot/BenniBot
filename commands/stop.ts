import { ChatInputCommandInteraction } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { SlashCommandBuilder } from '@discordjs/builders';
import { StoppedEmbed } from '../handler/embeds';
import { AudioLogger } from '../handler/logger';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription(
            'Stops the current playing music and leaves the Voice Channel'
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) return;

        if (interaction.member.voice.channel) {
            const connection = getVoiceConnection(
                interaction.member.voice.channel.guild.id
            );
            AudioLogger('Stop', interaction);
            interaction.reply({ embeds: [StoppedEmbed()] });
            if (connection) {
                connection.destroy();
            }
        } else {
            interaction.reply({
                content: 'You need to join the Voice Channel first!',
                allowedMentions: { repliedUser: true },
            });
        }
    },
};
