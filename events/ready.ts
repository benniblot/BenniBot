import { bot_info } from '../config.json';
import { generateDependencyReport } from '@discordjs/voice';
import { Client, ActivityType } from 'discord.js';

module.exports = {
    name: 'ready',
    once: true,
    execute(client: Client) {
        client.user.setActivity(`V${bot_info.version}`, {
            type: ActivityType.Playing,
        });

        console.log(
            `${client.user.tag}` +
                ' Version ' +
                bot_info.version +
                ' started sucessfully!'
        );

        if (process.env.DEV_MODE === 'true') {
            console.log(generateDependencyReport());
        }

        /*
		Version INFO: <Major.Minor.Revision.Build>
		- Major is a major update to the software
		- Minor is a small update to the software
		- Revision is any change made (bug fixes, small updates)
		*/
    },
};
