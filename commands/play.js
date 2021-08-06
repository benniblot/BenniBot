require('dotenv').config({
	path: '.env',
});
const {
	color,
} = require('../config.json');
const ytdl = require('ytdl-core-discord');
const Discord = require('discord.js');
const DiscordVoice = require('@discordjs/voice');
const YoutubeAPI = require('simple-youtube-api');
const youtube = new YoutubeAPI(process.env.api_key);
const day = new Date();
const h = String(day.getHours()).padStart(2, '0');
const mi = String(day.getMinutes()).padStart(2, '0');
const s = String(day.getSeconds()).padStart(2, '0');
const d = String(day.getDate()).padStart(2, '0');
const mo = String(day.getMonth() + 1).padStart(2, '0');
const y = String(day.getFullYear()).padStart(2, '0');


module.exports = {
	name: 'play',
	description: 'Joins your current Voice Channel and starts playing your selected music',
	args: true,
	usage: '<URL> or <name>',
	aliases: ['p'],
	async execute(message, args) {

		if (message.member.voice.channel) {
			const targetsong = args.join(' ');
			const YoutubeCheckPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
			const YoutubeCheck = YoutubeCheckPattern.test(args[0]);
			let songData = null;
			let song = null;
			if (YoutubeCheck) {
				try {
					songData = await ytdl.getInfo(args[0]);
					song = {
						title: songData.videoDetails.title,
						url: songData.videoDetails.video_url,
						duration: songData.videoDetails.lengthSeconds,
						thumbnail: songData.videoDetails.thumbnails[3].url,
					};
				} catch (error) {
					console.error(Error);
				}
			} else {

				try {
					const result = await youtube.searchVideos(targetsong, 1);
					songData = await ytdl.getInfo(result[0].url);

					song = {
						title: songData.videoDetails.title,
						url: songData.videoDetails.video_url,
						duration: songData.videoDetails.lengthSeconds,
						thumbnail: songData.videoDetails.thumbnails[3].url,
					};
				} catch (error) {
					console.log(error);
				}
			}

			const minutes = Math.floor(song.duration / 60);
			const seconds = song.duration - minutes * 60;
			const connection = await message.member.voiceChannel.join().catch();
			const stream = connection.play(await ytdl(song.url), {
				filter: 'audioonly',
				type: 'opus',
				quality: 'highestaudio',
			});
			stream.on('start', () => {
				console.log('[' + d + '-' + mo + '-' + y + ' ' + h + ':' + mi + ':' + s + '] ' + message.guild.name + ': playing - ' + song.title);
				const playing = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('BenniBot');
				if (minutes === 0 && seconds === 0) {
					playing.setFooter('Live');
				} else {
					playing.setFooter(minutes + 'm:' + seconds + 's');
				}
				playing.setTimestamp()
					.addFields({
						name: 'Now playing: ',
						value: song.title,
						inline: false,
					})
					.setThumbnail(song.thumbnail);
				message.channel.send({ embeds: [playing] });
			});

			stream.on('finish', () => {
				console.log('[' + d + '-' + mo + '-' + y + ' ' + h + ':' + mi + ':' + s + '] ' + message.guild.name + ': Stopped playing Music and left the Voice Channel');
				const stopped = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('BenniBot')
					.setFooter(song.url)
					.setTimestamp()
					.addFields({
						name: 'BenniBot: ',
						value: 'Stopped playing Music and left the Voice Channel',
						inline: true,
					});
				message.channel.send({ embeds: [stopped] });
				connection.disconnect();
			});
		} else {
			message.reply({ content: 'You need to join a Voice Channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};