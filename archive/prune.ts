import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Delete up to 99 messages.')
		.addIntegerOption(option =>
			option.setName('number')
				.setDescription('Number of Messages')
				.setRequired(true)),
	async execute(interaction: { options: { getInteger: (arg0: string) => string; }; reply: (arg0: { content: string; allowedMentions: { repliedUser: boolean; } | { repliedUser: boolean; } | { repliedUser: boolean; }; }) => void; channel: { bulkDelete: (arg0: number, arg1: boolean) => Promise<any>; }; }) {;
		const amount = parseInt(interaction.options.getInteger('number'));

		if (amount < 1 || amount > 99) {
			interaction.reply({ content: 'You need to input a number between 1 and 99.', allowedMentions: { repliedUser: true } });
		}
		console.log(amount)
		interaction.channel.bulkDelete(amount, true).catch((err: any) => {
			console.error(err);
			interaction.reply({ content: 'There was an error trying to prune messages in this channel!', allowedMentions: { repliedUser: true } });
		});
		interaction.reply({ content: amount + ' Messages got deleted', allowedMentions: { repliedUser: true } });
	},
};