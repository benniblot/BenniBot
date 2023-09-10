import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { ChatInputCommandInteraction, Client } from 'discord.js';
import { Song } from '../index';
import colors from 'colors';
colors.enable();

export function CreateLogMessage(
    level: 'Debug' | 'Info' | 'Warn' | 'Error',
    message: string
) {
    console.log(`[${level}] ${message}`);
}

export function VoiceStateLogger(
    connection: VoiceConnection,
    player: AudioPlayer
) {
    connection.on('stateChange', (oldState, newState) => {
        CreateLogMessage(
            'Debug',
            `VoiceStateLogger: Connection transitioned from ${oldState.status} to ${newState.status}`
        );
    });

    player.on('stateChange', (oldState, newState) => {
        CreateLogMessage(
            'Debug',
            `VoiceStateLogger: Audio player transitioned from ${oldState.status} to ${newState.status}`
        );
    });
}

export function AudioLogger(
    state: 'Play' | 'Stop' | 'AutoStop',
    interaction: ChatInputCommandInteraction,
    song?: Song
) {
    let msg = `${state}: `;
    const username = interaction.member.user.username;
    const guildname = interaction.guild.name;

    switch (state) {
        case 'Play':
            msg += `${song.title.gray} from ${username.gray} on `;
            break;
        case 'Stop':
            msg += `${username.gray} on `;
            break;
    }

    msg += `${guildname.gray}`;

    CreateLogMessage('Info', msg);
}

export function StartupLogger(client: Client, version: string) {
    CreateLogMessage(
        'Info',
        `Ready: ${client.user.tag} Version ${version} started successfully!`
    );
}

export function ErrorLogger(error: Error) {
    CreateLogMessage('Error', `${error.name}: ${error.message}`);
}

//TODO: Continue creating Custom Logger
