import { bot_info } from '../config.json';
import { generateDependencyReport } from '@discordjs/voice';
import { Client, ActivityType } from 'discord.js';
import { CreateLogMessage, StartupLogger } from '../handler/logger';

module.exports = {
    name: 'ready',
    once: true,
    execute(client: Client) {
        client.user.setActivity(`V${bot_info.version}`, {
            type: ActivityType.Playing,
        });

        StartupLogger(client, bot_info.version);

        if (process.env.DEV_MODE === 'true') {
            CreateLogMessage('Debug', generateDependencyReport());
        }

        /*
		Version INFO: <Major.Minor.Revision.Build>
		- Major is a major update to the software
		- Minor is a small update to the software
		- Revision is any change made (bug fixes, small updates)
		*/
    },
};
