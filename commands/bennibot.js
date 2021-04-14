const ytdl = require('ytdl-core');

module.exports = {
	name: 'bennibot',
	description: 'Benni Bots Secret',
	args: false,
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();
			console.log('BenniBot EarRaped');
			const dispatcher = connection.play(ytdl('https://youtu.be/-HZE1XBqC6M', {
				filter: 'audioonly',
			}));

			dispatcher.on('finish', () => {
				connection.disconnect();
			});
		} else {
			message.reply('You need to join a voice channel first!');
		}
	},
};