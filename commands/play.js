const { SlashCommandBuilder } = require('@discordjs/builders');
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
const time = require('../time.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joins your current Voice Channel and starts playing your selected music')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('YouTube URL')
				.setRequired(true)),
	async execute(interaction) {
		if (interaction.member.voice.channel) {
			const targetsong = interaction.options.getString('url');
			const YoutubeCheckPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
			const YoutubeCheck = YoutubeCheckPattern.test(interaction.options.getString('url'));
			let songData = null;
			let song = null;
			if (YoutubeCheck) {
				try {
					songData = await ytdl.getInfo(interaction.options.getString('url'));
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
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.member.guild.id,
				adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
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

			var [h,mi,s,d,mo,y] = time.execute();
			console.log('[' + d + '-' + mo + '-' + y + ' ' + h + ':' + mi + ':' + s + '] ' + interaction.guild.name + ': playing - ' + song.title);

			//Reply when Playing
			const playing = new Discord.MessageEmbed()
				.setColor(color)
				.setTitle('BenniBot');
			if (minutes === 0 && seconds === 0) {
				playing.setFooter('Live');
			}
			else {
				playing.setFooter(minutes + 'm ' + seconds + 's');
			}
			playing.addFields({
					name: 'Now playing: ',
					value: song.title + "\n" + song.url,
					inline: false,
				})
				.setThumbnail(song.thumbnail);
				interaction.reply({ embeds: [playing] });
			//End of Reply

			player.on(AudioPlayerStatus.Idle, () => {
				var [h,mi,s,d,mo,y] = time.execute();
				console.log('[' + d + '-' + mo + '-' + y + ' ' + h + ':' + mi + ':' + s + '] ' + interaction.guild.name + ': Stopped playing Music and left the Voice Channel');
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
					interaction.followUp({ embeds: [stopped] });
				connection.destroy();
			});
		}
		else {
			interaction.reply({ content: 'You need to join a Voice Channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};