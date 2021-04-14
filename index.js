require('dotenv').config({
	path: 'config.env',
});
const Discord = require('discord.js');
const fs = require('fs');

const beta = false;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const {
	prefix,
	bot_info,
} = require('./config.json');

if (beta === false) {
	client.login(process.env.token);
} else if (beta === true) {
	client.login(process.env.tokenb);
	console.log('===BETA===');
}


client.once('ready', () => {
	// client.user.setActivity('Version ' + bot_info.version, {
	client.user.setActivity('RIP BeniBlot V2', {
		type: 'PLAYING',
	});
	console.log(bot_info.name + ' V' + bot_info.version + ' started sucessfully!');
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (command.args && !args.length) {
		const argerror = new Discord.MessageEmbed()
			.setColor('#ff0000')
			.setTitle('ERROR')
			.setDescription('Not enough arguments.')
			.setFooter('Bot Error Log')
			.addFields({
				name: 'Usage: ',
				value: `${prefix}${command.name} ${command.usage}`,
				inline: true,
			})
			.setTimestamp();
		return message.channel.send(argerror);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an issue executing that command!');
	}
});