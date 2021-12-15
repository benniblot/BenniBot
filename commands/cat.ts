import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('A random cat photo'),
	async execute(interaction) {
		const response = await window.fetch('https://aws.random.cat/meow');
		interaction.reply({ content: response.url });
	},
};