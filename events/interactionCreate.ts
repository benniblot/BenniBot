import { Interaction, Events } from 'discord.js';
import { CreateLogMessage } from '../handler/logger';

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            CreateLogMessage(
                'Error',
                `Interaction: No command matching ${interaction.commandName} was found.`
            );
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            CreateLogMessage(
                'Error',
                `Interaction: Error executing ${interaction.commandName}`
            );
            console.error(error);
        }
    },
};
