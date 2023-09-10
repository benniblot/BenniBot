import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { SupportedPlatformsEmbed } from '../handler/embeds';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('supportedplatforms')
        .setDescription('Lists all supported platforms'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            embeds: [
                SupportedPlatformsEmbed(),
            ],
        });
    },
};
