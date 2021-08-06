require('dotenv').config({
	path: '.env',
});
const Discord = require('discord.js');
const fs = require('fs');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const {
	prefix,
	bot_info,
} = require('./config.json');

client.login(process.env.tokenb);

client.once('ready', () => {
	client.user.setActivity('WARTUNG: ' + bot_info.version, {
		type: 'PLAYING',
	});
	console.log(`${client.user.tag}` + ' Version ' + bot_info.version + ' started sucessfully!');
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
client.on('messageCreate', message => {
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
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply('There was an issue executing that command!');
	}
});