const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

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
			message.reply({ content: 'You need to join a voice channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};