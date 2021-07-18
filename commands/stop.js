const Discord = require('discord.js');

module.exports = {
	name: 'stop',
	description: 'Stops the current playing music and leaves the Voice Channel',
	args: false,
	aliases: ['s', 'leave', 'l'],
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = await message.member.voiceChannel.join();
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
			message.channel.send(stopped);
			connection.disconnect();
		} else {
			message.reply('You need to join a Voice Channel first!');
		}
	},
};