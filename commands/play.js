const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config({
	path: '.env',
});
const ytdl = require('ytdl-core-discord');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
const YoutubeAPI = require('simple-youtube-api');
const youtube = new YoutubeAPI(process.env.api_key);
const time = require('../handler/time.js');
const embeds = require('../handler/embeds.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joins your current Voice Channel and starts playing your selected music')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('YouTube URL or Name of the Song')
				.setRequired(true)),
	async execute(interaction) {
		interaction.deferReply();
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

			const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.member.guild.id,
				adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
			});
			var stream = await ytdl(song.url, {
				highWaterMark: 1 << 25,
				filter: 'audioonly',
			});
			const player = createAudioPlayer();
			const resource = createAudioResource(stream, { inputType: StreamType.Opus });
			connection.subscribe(player);
			player.play(resource);

			connection.on('stateChange', (oldState, newState) => {
				console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
			});

			player.on('stateChange', (oldState, newState) => {
				console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
			});

			var [h,mi,s,d,mo,y] = time.execute();
			console.log('[' + d + '-' + mo + '-' + y + ' ' + h + ':' + mi + ':' + s + '] ' + interaction.guild.name + ': playing - ' + song.title);
			const playing = embeds.playing(song);
			interaction.editReply({ embeds: [playing] });

			player.on(AudioPlayerStatus.Idle, () => {
				var [h,mi,s,d,mo,y] = time.execute();
				console.log('[' + d + '-' + mo + '-' + y + ' ' + h + ':' + mi + ':' + s + '] ' + interaction.guild.name + ': Stopped playing and left');
				const stopped = embeds.stopped(song);
				interaction.followUp({ embeds: [stopped] });
				connection.destroy();
			});
		}
		else {
			interaction.editReply({ content: 'You need to join a Voice Channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};