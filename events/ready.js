"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = require("../config.json");
var voice_1 = require("@discordjs/voice");
module.exports = {
    name: 'ready',
    once: true,
    execute: function (client) {
        client.user.setActivity("V " + config_json_1.bot_info.version, {
            type: 'PLAYING',
        });
        console.log("" + client.user.tag + ' Version ' + config_json_1.bot_info.version + ' started sucessfully!');
        if (process.env.DEV_MODE === "true") {
            console.log((0, voice_1.generateDependencyReport)());
        }
    },
};
