const ytdl = require('ytdl-core-discord');
const Discord = require('discord.js');
const { API_KEY } = require('../config.json');
const YoutubeAPI = require('simple-youtube-api');
const youtube = new YoutubeAPI(API_KEY);

module.exports = {
	name: 'play',
	description: 'Joins your current Voice Channel and starts playing your selected music',
	args: true,
	usage: '<youtube link> or <name>',
	aliases: ['p'],
	async execute(message, args) {

		if (message.member.voice.channel) {
			const targetsong = args.join(' ');
			const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
			const urlcheck = videoPattern.test(args[0]);
			let songData = null;
			let song = null;
			if(urlcheck) {
				try {
					songData = await ytdl.getInfo(args[0]);
					song = {
						title: songData.videoDetails.title,
						url: songData.videoDetails.video_url,
						duration: songData.videoDetails.lengthSeconds,
						thumbnail: songData.videoDetails.thumbnail.thumbnails[3].url,
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
						thumbnail: songData.videoDetails.thumbnail.thumbnails[3].url,
					};
				} catch (error) {
					console.log(error);
				}
			}

			const minutes = Math.floor(song.duration / 60);
			const seconds = song.duration - minutes * 60;
			const connection = await message.member.voice.channel.join().catch();
			const stream = connection.play(await ytdl(song.url), {
				highWaterMark: 1 << 25,
				filter: 'audioonly',
				type: 'opus',
				quality: 'highestaudio',
			});
			stream.on('start', () => {
				console.log(message.guild.name + ': playing - ' + song.title);
				const playing = new Discord.MessageEmbed()
					.setColor('#42b3f5')
					.setTitle('BenniBot')
					.setFooter(minutes + 'm:' + seconds + 's')
					.setTimestamp()
					.addFields(
						{ name: 'Now playing: ', value: song.title, inline: false },
					)
					.setThumbnail(song.thumbnail);
				message.channel.send(playing);
			});

			stream.on('finish', () => {
				console.log(message.guild.name + ': Stopped playing Music and left the Voice Channel');
				const stopped = new Discord.MessageEmbed()
					.setColor('#00ff00')
					.setTitle('BenniBot')
					.setFooter(song.url)
					.setTimestamp()
					.addFields(
						{ name: 'BenniBot: ', value: 'Stopped playing Music and left the Voice Channel', inline: true },
					);
				message.channel.send(stopped);
				connection.disconnect();
			});
		} else {
			message.reply('You need to join a Voice Channel first!');
		}
	},
};