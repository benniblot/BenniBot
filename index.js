"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var fs_1 = __importDefault(require("fs"));
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates
    ]
});
client.commands = new discord_js_1.Collection();
var commandFiles = fs_1.default.readdirSync('./commands').filter(function (file) { return file.endsWith('.js'); });
for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
    var file = commandFiles_1[_i];
    var command = require("./commands/" + file);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}
var eventFiles = fs_1.default.readdirSync('./events').filter(function (file) { return file.endsWith('.js'); });
var _loop_1 = function (file) {
    var event_1 = require("./events/" + file);
    if (event_1.once) {
        client.once(event_1.name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return event_1.execute.apply(event_1, args);
        });
    }
    else {
        client.on(event_1.name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return event_1.execute.apply(event_1, args);
        });
    }
};
for (var _a = 0, eventFiles_1 = eventFiles; _a < eventFiles_1.length; _a++) {
    var file = eventFiles_1[_a];
    _loop_1(file);
}
client.login(process.env.token);
