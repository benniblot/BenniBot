module.exports = {
	name: 'interactionCreate',
	async execute(interaction: { isCommand: () => any; client: { commands: { get: (arg0: any) => any; }; }; commandName: any; reply: (arg0: { content: string; ephemeral: boolean; }) => any; }) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
	
		if (!command) return;
	
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};