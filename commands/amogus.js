const ytdl = require('ytdl-core');

module.exports = {
	name: 'amogus',
	description: 'Amogus :D',
	args: false,
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();
			console.log('Amogus');
			const dispatcher = connection.play(ytdl('https://youtu.be/2FfSu_B2_-8', {
				filter: 'audioonly',
			}));
			dispatcher.setvolume(2);
			dispatcher.on('finish', () => {
				connection.disconnect();
			});
		} else {
			message.reply('You need to join a voice channel first!');
		}
	},
};