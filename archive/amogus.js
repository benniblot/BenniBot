const ytdl = require('ytdl-core');

module.exports = {
	name: 'amogus',
	description: 'Amogus :D',
	args: false,
	async execute(message) {
		if (message.member.voice.channel) {
			message.member.voice.channel.join().then(connection => {
				const dispatcher = connection.play(ytdl('https://youtu.be/2FfSu_B2_-8', {
					filter: 'audioonly',
				}));
				console.log('Amogus');
				dispatcher.setVolume(2);
				dispatcher.on('finish', () => {
					connection.disconnect();
				});
			});
		} else {
			message.reply({ content: 'You need to join a voice channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};