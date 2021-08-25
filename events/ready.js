const { bot_info } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setActivity('WARTUNG: ' + bot_info.version, {
			type: 'PLAYING',
		});
		console.log(`${client.user.tag}` + ' Version ' + bot_info.version + ' started sucessfully!');
	},
};