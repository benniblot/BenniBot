import { REST, Routes, RESTPutAPIApplicationCommandsResult } from 'discord.js';
import { clientId, guildId } from './config.json';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'node:fs';
import path from 'node:path';

const commands: Array<JSON> = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.token);

// and deploy your commands!
(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        let data: Array<RESTPutAPIApplicationCommandsResult>;

        if (process.env.DEV_MODE === 'true') {
            // Guild only Slash Commands: is used to fully refresh all commands in the guild with the current set
            data = (await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands }
            )) as Array<RESTPutAPIApplicationCommandsResult>;
        } else {
            // Global Slash Commands
            data = (await rest.put(Routes.applicationCommands(clientId), {
                body: commands,
            })) as Array<RESTPutAPIApplicationCommandsResult>;
        }

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
