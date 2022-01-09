import { SlashCommandBuilder } from '@discordjs/builders'
import {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('teams')
		.setDescription('Teams ;)')
        .addStringOption(option => 
			option.setName('volume')
				.setDescription('Volume of the Song')),
	async execute(interaction) {
		if (interaction.member.voice.channel) {
			const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.member.guild.id,
				adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
			});
			const volume = interaction.options.getString('volume') ? interaction.options.getString('volume') : '0.5';

			const player = createAudioPlayer();
            const resource = createAudioResource('../assets/teams.mp3', { inputType: StreamType.Opus, inlineVolume: true });
	
			resource.volume.setVolume(volume);

			connection.subscribe(player);
			player.play(resource);

			console.log('[Play] "Teams ;)" on "' + interaction.guild.name + '" by "' + interaction.member.user.username + '"');
			interaction.reply({ content: 'Teams ;)' });
			player.on(AudioPlayerStatus.Idle, () => {
				console.log('[AutoStop] on "' + interaction.guild.name + '"');
				connection.destroy();
			});
			
		}
		else {
			interaction.reply({ content: 'You need to join a Voice Channel first!', allowedMentions: { repliedUser: true } });
		}
	},
};