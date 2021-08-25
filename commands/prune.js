const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Delete up to 99 messages.')
		.addIntegerOption(option =>
			option.setName('number')
				.setDescription('Number of Messages')
				.setRequired(true)),
	async execute(interaction) {;
		const amount = parseInt(interaction.options.getInteger('number')) + 1;

		if (amount <= 1 || amount > 100) {
			interaction.reply({ content: 'You need to input a number between 1 and 99.', allowedMentions: { repliedUser: true } });
		}

		interaction.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			interaction.reply({ content: 'There was an error trying to prune messages in this channel!', allowedMentions: { repliedUser: true } });
		});
		interaction.reply({ content: amount-1 + ' Messages got deleted', allowedMentions: { repliedUser: true } });
	},
};