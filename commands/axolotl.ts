import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('axolotl')
		.setDescription('A random axolotl photo or a nice fact about them')
		.addBooleanOption(option =>
			option.setName('fact')
				.setDescription('Get a random fact about axolotl')
				.setRequired(false)), 
	async execute(interaction) {
		await interaction.deferReply()
		const { url, facts } = await fetch('https://axoltlapi.herokuapp.com').then(response => response.json())
		if (interaction.options.getBoolean('fact')) {
			interaction.followUp({ content: facts })
		} else {
			interaction.editReply({ content: url })
		}
		
	},
};