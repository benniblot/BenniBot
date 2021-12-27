import Discord from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'
import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the current playing music and leaves the Voice Channel'),
	async execute(interaction) {
		if (interaction.member.voice.channel) {
			const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);
			console.log('[Stop] by "' + interaction.member.user.username + '" on "' + interaction.guild.name + '"');
			const stopped = new Discord.MessageEmbed()
				.setColor('#0000ff')
				.setTitle('BenniBot')
				.setTimestamp()
				.addFields({
					name: 'Stopped playing:',
					value: 'Leaving the Voice Channel',
					inline: true,
				});
				interaction.reply({ embeds: [stopped] });
			if(connection){
				connection.destroy();
			}
		} else {
			interaction.reply({ content: 'You need to join the Voice Channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};