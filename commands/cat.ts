import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import https from 'https';
import { ErrorLogger } from '../handler/logger';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('A random cat photo'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        https
            .get('https://aws.random.cat/meow', function (res) {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    interaction.editReply({ content: JSON.parse(body).file });
                });
            })
            .on('error', function (e) {
                ErrorLogger(e);
            });
    },
};
