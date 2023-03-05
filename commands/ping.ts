import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { PingEmbed } from '../handler/embeds';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: ChatInputCommandInteraction) {
        const pingStart = new EmbedBuilder()
            .setColor(0xffffff)
            .setTitle('Pinging...');
        const sent = await interaction.reply({
            embeds: [pingStart],
            fetchReply: true,
        });
        await interaction.editReply({
            embeds: [
                PingEmbed(
                    sent.createdTimestamp - interaction.createdTimestamp,
                    interaction.client.ws.ping
                ),
            ],
        });
    },
};
