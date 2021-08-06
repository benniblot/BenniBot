const Discord = require('discord.js');
const {
	getVoiceConnection,
} = require('@discordjs/voice');


module.exports = {
	name: 'stop',
	description: 'Stops the current playing music and leaves the Voice Channel',
	args: false,
	aliases: ['s', 'leave', 'l'],
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = getVoiceConnection(message.member.voice.channel.guild.id);
			console.log(message.guild.name + ': Stopped playing Music and left the Voice Channel');
			const stopped = new Discord.MessageEmbed()
				.setColor('#0000ff')
				.setTitle('BenniBot')
				.setTimestamp()
				.addFields({
					name: 'Now playing:',
					value: 'stopped playing music and left the Voice Channel',
					inline: true,
				});
			message.channel.send({ embeds: [stopped] });
			connection.destroy();
		} else {
			message.reply({ content: 'You need to join the Voice Channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};