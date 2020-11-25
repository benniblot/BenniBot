module.exports = {
	name: 'ping',
	description: 'Ping Command',
	args: false,
	execute(message) {
		message.channel.send('Pong!');
	},
};