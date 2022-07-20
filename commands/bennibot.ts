import { SlashCommandBuilder } from '@discordjs/builders'
import {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice'
import ytdl from 'ytdl-core-discord'
import chalk from 'chalk'

const embeds = require('../handler/embeds') 
const logger = require('../handler/VoiceStateLogger')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('benbot')
		.setDescription('BenniBots Secret')
		.addNumberOption(option =>
			option.setName('number')
				.setDescription('Secret Number')
		),
	async execute(interaction) {
		interaction.deferReply()
		if (interaction.member.voice.channel) {
			let songData = null
			let song: { url: string; title: string; duration: string; thumbnail: string } = null
			try {
				songData = await ytdl.getInfo("https://www.youtube.com/watch?v=-A93yVA5aLQ")
				song = {
					title: songData.videoDetails.title,
					url: songData.videoDetails.video_url,
					duration: songData.videoDetails.lengthSeconds,
					thumbnail: songData.videoDetails.thumbnails[3].url,
				}
			}
			catch (error) {
				console.error(Error)
			}

			const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.member.guild.id,
				adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
			})
			let stream = await ytdl(song.url, {
				highWaterMark: 1 << 25,
				filter: 'audioonly',
				quality: 'highestaudio',
			})

			const player = createAudioPlayer()
			const resource = createAudioResource(stream, { inputType: StreamType.Opus, inlineVolume: true, })

			resource.volume.setVolume(0.5)

			connection.subscribe(player)
			player.play(resource)

			// Execute the VoiceStateLogger to log the current state of the player when DevMode is true
			if(process.env.DEV_MODE === "true"){
				logger.execute(connection,player)
			}

			if(song){
				console.log('[Play] ' + chalk.gray(`${song.title}`) + ' on ' + chalk.gray(`${interaction.guild.name}`) + ' by ' + chalk.gray(`${interaction.member.user.username}`))
			}
			const playing = embeds.playing(song, 0.5)

			interaction.editReply({ embeds: [playing] })

			player.on(AudioPlayerStatus.Idle, () => {
				console.log('[AutoStop] on "' + interaction.guild.name + '"')
				const stopped = embeds.stopped(song)
				interaction.followUp({ embeds: [stopped] })
				connection.destroy()
			})

		}
		else {
			interaction.reply({ content: 'You need to join a Voice Channel first!', allowedMentions: { repliedUser: true } })
		}
	},
}