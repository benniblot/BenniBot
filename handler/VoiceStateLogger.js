"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'VoiceStateLogger',
    execute: function (connection, player) {
        connection.on("stateChange", function (oldState, newState) {
            console.log("Connection transitioned from " + oldState.status + " to " + newState.status);
        });
        player.on("stateChange", function (oldState, newState) {
            console.log("Audio player transitioned from " + oldState.status + " to " + newState.status);
        });
    }
};
