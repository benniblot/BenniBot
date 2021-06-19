module.exports = {
	name: 'bigben',
	description: 'BigBen Function',
	async execute(message) {
		// eslint-disable-next-line prefer-const
		let time = new Date();
		// eslint-disable-next-line prefer-const
		let hour = time.getHours();
		const connection = await message.member.voice.channel.join();
		let count = 1;
		(function play() {
			const dispatcher = connection.play('./media./bigben.mp3', {
				volume: 0.5,
			});
			dispatcher.on('finish', () => {
				count++;
				if (count <= hour) {
					play();
				} else {
					connection.disconnect();
				}
			});
		})();
	},
};