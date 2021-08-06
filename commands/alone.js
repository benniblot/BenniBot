const ytdl = require('ytdl-core');

module.exports = {
	name: 'alone',
	description: 'Use this command when you are alone',
	args: false,
	aliases: ['ineedhelp'],
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();
			const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=Dzdg-0vldW4', {
				filter: 'audioonly',
			}));
			dispatcher.on('start', () => {
				console.log('BenniBot is hearing your beautiful voice <3');
			});

			dispatcher.on('finish', () => {
				message.reply({ content: 'Ok', allowedMentions: { repliedUser: false } });
				console.log('BenniBot stopped');
				connection.disconnect();
			});
		} else {
			message.reply({ content: 'You need to join a voice channel first, so I can hear your beautiful voice :)', allowedMentions: { repliedUser: true } });
		}
	},
};