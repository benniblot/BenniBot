module.exports = {
	name: 'prune',
	description: 'Delete up to 99 messages.',
	usage: '<number of messages>',
	aliases: ['clear', 'clean', 'cls'],
	args: true,
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;

		if (amount <= 1 || amount > 100) {
			return message.reply('You need to input a number between 1 and 99.');
		}

		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('There was an error trying to prune messages in this channel!');
		});
	},
};