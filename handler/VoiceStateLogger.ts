import { AudioPlayer, VoiceConnection } from '@discordjs/voice';

export function VoiceStateLogger(
    connection: VoiceConnection,
    player: AudioPlayer
) {
    connection.on('stateChange', (oldState, newState) => {
        console.log(
            `[VoiceStateLogger] Connection transitioned from ${oldState.status} to ${newState.status}`
        );
    });

    player.on('stateChange', (oldState, newState) => {
        console.log(
            `[VoiceStateLogger] Audio player transitioned from ${oldState.status} to ${newState.status}`
        );
    });
}
