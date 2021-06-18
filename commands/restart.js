const config = require('../config.json');

module.exports = {
	name: 'restart',
	description: 'Restarting the Bot (Only Possible as an Admin)',
	args: true,
	usage: '[Reason]',
	execute(message, args, client) {
		if (message.author.id == config.owner_id) {
			message.channel.send('Restarting the client: ' + args[0]);
			client.destroy();
			message.channel.send('Destroyed the client ' + client.uptime);
			client.login(process.env.token);
			message.channel.send('Started the client ' + client.uptime);
		} else {
			message.channel.send('Nice try but you are not an admin :D ');
		}
	},
};