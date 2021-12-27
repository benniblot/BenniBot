import { SlashCommandBuilder } from '@discordjs/builders'
import ytdl from 'ytdl-core-discord'
import {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice'
import Discord from 'discord.js'

import ytsearch from '../handler/ytsearch' 
import { MessageActionRow, MessageButton } from 'discord.js'
const embeds = require('../handler/embeds') 
const logger = require('../handler/VoiceStateLogger')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joins your current Voice Channel and starts playing your selected music')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('YouTube URL or Name of the Song')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('volume')
				.setDescription('Volume of the Song'))
		.addStringOption(option =>
			option.setName('loop')
				.setDescription('Loop the Song')),	
	async execute(interaction) {
		interaction.deferReply();
		if (interaction.member.voice.channel) {
			const targetsong:string = interaction.options.getString('url');
			const YoutubeCheckPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
			const YoutubeCheck = YoutubeCheckPattern.test(interaction.options.getString('url'));
			let songData = null;
			let song: { url: any; title: any; duration: string; thumbnail: string } | null = null;
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
					 const result:string = await ytsearch.execute(targetsong);
					 songData = await ytdl.getInfo(result);
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

			/*// save the songs in a queue to play later
			const queue = interaction.guild.voice.queue;
			if (song) {
				queue.push(song);
			}
			if (queue.length === 1) {
				const voiceAdapter = interaction.guild.voice.voiceAdapterCreator.createVoiceAdapter(interaction.guild.id);
				const voiceConnection = await joinVoiceChannel({
					guildId: interaction.guild.id, 
					channelId: interaction.member.voice.channel.id, 
					adapterCreator: voiceAdapter
				});
				const audioPlayer = createAudioPlayer();
				try{
					var stream = await ytdl(song.url, {
					filter: 'audioonly',
					quality: 'highestaudio',
					highWaterMark: 1 << 25
					});
				} catch (error) {
					console.log(error);
				}
				const audioResource = createAudioResource(stream, { inputType: StreamType.Opus });
				voiceConnection.subscribe(audioPlayer);
				audioPlayer.play(audioResource);
				if (AudioPlayerStatus.Playing) {
					const embed = embeds.createEmbed(song.title, song.thumbnail, song.duration);
					interaction.editReply({ embeds: [embed] });
					interaction.followUp({ embeds: [embed] });
					logger.log(interaction.guild.id, interaction.member.id, song.title, song.url, song.duration, song.thumbnail, 'play')
				}
				else {
					interaction.reply({ content: 'Something went wrong while playing the song', allowedMentions: { repliedUser: true } });
				}
			}
			else {
				const embed = embeds.createEmbed(song.title, song.thumbnail, song.duration);
				interaction.editReply({ embeds: [embed] });
				interaction.followUp({ embeds: [embed] });
				logger.log(interaction.guild.id, interaction.member.id, song.title, song.url, song.duration, song.thumbnail, 'play')
			}
			console.log(queue);
			*/			// END OF THE CODE

			
			const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.member.guild.id,
				adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
			});
			var stream = await ytdl(song.url, {
					highWaterMark: 1 << 25,
					filter: 'audioonly',
					quality: 'highestaudio'
			});
			const volume = interaction.options.getString('volume') ? interaction.options.getString('volume') : '0.5';

			const player = createAudioPlayer();
			const resource = createAudioResource(stream, { inputType: StreamType.Opus, inlineVolume: true });
		
			resource.volume.setVolume(volume);

			connection.subscribe(player);
			player.play(resource);

			// Execute the VoiceStateLogger to log the current state of the player when DevMode is true
			if(process.env.DEV_MODE === "true"){
				logger.execute(connection,player)
			}

			if(song){
				console.log('[Play] ' + song.title + ' on ' + interaction.guild.name + ' by ' + interaction.member.user.username);
			}
			const playing = embeds.playing(song, volume);

			interaction.editReply({ embeds: [playing] });
			
			player.on(AudioPlayerStatus.Idle, () => {
				console.log('[AutoStop] on' + interaction.guild.name);
				const stopped = embeds.stopped(song);
				interaction.followUp({ embeds: [stopped] });
				connection.destroy();
			});
			
		}
		else {
			interaction.reply({ content: 'You need to join a Voice Channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};