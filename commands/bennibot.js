const ytdl = require('ytdl-core-discord');
const DiscordVoice = require('@discordjs/voice');

module.exports = {
	name: 'bennibot',
	description: 'Benni Bots Secret',
	args: false,
	async execute(message) {
		if (message.member.voice) {
			const connection = DiscordVoice.joinVoiceChannel();
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