import { AudioPlayer, VoiceConnection } from '@discordjs/voice'

module.exports = {
    name: 'VoiceStateLogger',
    execute: function (connection: VoiceConnection, player: AudioPlayer) {
        connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        })

        player.on('stateChange', (oldState, newState) => {
            console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        })
    }
};