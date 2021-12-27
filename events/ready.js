"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = require("../config.json");
var generateDependencyReport = require('@discordjs/voice').generateDependencyReport;
module.exports = {
    name: 'ready',
    once: true,
    execute: function (client) {
        client.user.setActivity(config_json_1.bot_info.version, {
            type: 'PLAYING',
        });
        console.log("" + client.user.tag + ' Version ' + config_json_1.bot_info.version + ' started sucessfully!');
        if (process.env.DEV_MODE === "true") {
            console.log(generateDependencyReport());
        }
        /*
        Version INFO: <Major.Minor.Revision.Build>
        - Major is a major update to the software
        - Minor is a small update to the software
        - Revision is any change made (bug fixes, small updates)
        - Build number (normally an auto increment if used)
        */
    },
};
