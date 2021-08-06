module.exports = {
	name: 'carol',
	description: 'Carol Secret',
	args: false,
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();
			console.log('BenniBot is playing Carol :)');
			const dispatcher = connection.play('./media./carol.mp3');

			dispatcher.on('finish', () => {
				connection.disconnect();
				console.log('BenniBot stopped');
			});
		} else {
			message.reply({ content: 'You need to join a voice channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};