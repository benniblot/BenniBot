require('dotenv').config({
	path: '.env',
});
const {
	color,
} = require('../config.json');
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
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
				}
				catch (error) {
					console.error(Error);
				}
			}
			else {

				try {
					const result = await youtube.searchVideos(targetsong, 1);
					songData = await ytdl.getInfo(result[0].url);

					song = {
						title: songData.videoDetails.title,
						url: songData.videoDetails.video_url,
						duration: songData.videoDetails.lengthSeconds,
						thumbnail: songData.videoDetails.thumbnails[3].url,
					};
				}
				catch (error) {
					console.log(error);
				}
			}

			const minutes = Math.floor(song.duration / 60);
			const seconds = song.duration - minutes * 60;

			const connection = joinVoiceChannel({
				channelId: message.member.voice.channel.id,
				guildId: message.member.guild.id,
				adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
			});
			const stream = await ytdl(song.url, {
				filter: 'audioonly',
			});
			const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
			const player = createAudioPlayer();
			connection.on('stateChange', (oldState, newState) => {
				console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
			});

			player.on('stateChange', (oldState, newState) => {
				console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
			});
			player.play(resource);
			connection.subscribe(player);

			player.on(AudioPlayerStatus.Playing, () => {
				console.log('[' + d + '-' + mo + '-' + y + ' ' + h + ':' + mi + ':' + s + '] ' + message.guild.name + ': playing - ' + song.title);
				const playing = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('BenniBot');
				if (minutes === 0 && seconds === 0) {
					playing.setFooter('Live');
				}
				else {
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

			player.on(AudioPlayerStatus.Idle, () => {
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
				connection.destroy();
			});
		}
		else {
			message.reply({ content: 'You need to join a Voice Channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};