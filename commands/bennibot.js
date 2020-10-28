const ytdl = require('ytdl-core');

module.exports = {
	name: 'bennibot',
	description: 'Benni Bots Secret',
	args: false,
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();
			const dispatcher = connection.play(ytdl('https://youtu.be/-HZE1XBqC6M', { filter: 'audioonly' }));
			dispatcher.on('start', () => {
				console.log('BenniBot is EarRaping you :)');
			});

			dispatcher.on('finish', () => {
				console.log('BenniBot stopped');
			});
		} else {
			message.reply('You need to join a voice channel first!');
		}
	},
};