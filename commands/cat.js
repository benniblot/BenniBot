const fetch = import('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('A random cat photo'),
	async execute(interaction) {
		const {
			file,
		} = await fetch('https://aws.random.cat/meow').then(response => response.json());
		interaction.reply({content: file });
	},
};