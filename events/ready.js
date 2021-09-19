const { bot_info } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setActivity('Version ' + bot_info.version, {
			type: 'PLAYING',
		});
		console.log(`${client.user.tag}` + ' Version ' + bot_info.version + ' started sucessfully!');
		/*
		Version INFO: <Major.Minor.Revision.Build>
		- Major is a major update to the software
		- Minor is a small update to the software
		- Revision is any change made (bug fixes, small updates)
		- Build number (normally an auto increment if used)
		*/
	},
};