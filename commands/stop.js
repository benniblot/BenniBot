const Discord = require('discord.js');

module.exports = {
	name: 'stop',
	description: 'Stops the current playing music and leaves the Voice Channel',
	args: false,
	aliases: ['s', 'leave', 'l'],
	async execute(message) {
		const {
			bot_info,
		} = require('../config.json');
		if (message.member.voice.channel) {
			if (message.guild.voiceConnection) {
				const connection = message.member.voiceChannel;
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
				connection.disconnect();
			} else {
				message.reply({ content: bot_info.name + ' is not connected to a Voice Channel', allowedMentions: { repliedUser: true } });
			}

		} else {
			message.reply({ content: 'You need to join the Voice Channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};