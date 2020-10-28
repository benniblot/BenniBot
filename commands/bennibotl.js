const ytdl = require('ytdl-core');

module.exports = {
	name: 'bennibotl',
	description: 'Benni Bots 2. Secret',
	args: false,
	async execute(message) {
		message.channel.send('Wer ist der Boss? :)', { files: ['./images/boss.png'] });
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();
			const dispatcher = connection.play(ytdl('https://youtu.be/-HZE1XBqC6M', { filter: 'audioonly' }));
			dispatcher.on('start', () => {
				console.log('BenniBot is EarRaping you :)');
			});

			dispatcher.on('finish', () => {
				console.log('BenniBot stopped');
				message.channel.send('&bennibot');
				message.channel.bulkDelete(1, true);
			});
		} else {
			message.reply('You need to join a voice channel first!');
		}
	},
};