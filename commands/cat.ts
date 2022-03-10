import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('A random cat photo'),
	async execute(interaction) {
		await interaction.deferReply()
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json())
		interaction.editReply({ files: [file] })
	},
};