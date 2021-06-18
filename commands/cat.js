const fetch = require('node-fetch');

module.exports = {
	name: 'cat',
	description: 'A random cat photo',
	args: false,
	async execute(message) {
		const {
			file,
		} = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send(file);
	},
};