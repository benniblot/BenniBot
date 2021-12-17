"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
module.exports = {
    name: 'embeds',
    playing: function (song, volume) {
        var minutes = Math.floor(song.duration / 60);
        var seconds = song.duration - minutes * 60;
        var playing = new discord_js_1.default.MessageEmbed()
            .setColor('GREEN')
            .setTitle('BenniBot');
        if (minutes === 0 && seconds === 0) {
            playing.setFooter('Live');
        }
        else if (minutes === 0 && seconds > 0) {
            playing.setFooter(seconds + 's');
        }
        else if (minutes > 0 && seconds === 0) {
            playing.setFooter(minutes + 'm');
        }
        else {
            playing.setFooter(minutes + 'm ' + seconds + 's');
        }
        playing.addFields({
            name: 'Now playing: ',
            value: song.title + "\n" + song.url + "\nVolume: " + volume,
            inline: false,
        })
            .setThumbnail(song.thumbnail);
        return playing;
    },
    stopped: function (song) {
        var stopped = new discord_js_1.default.MessageEmbed()
            .setColor('GREEN')
            .setTitle('BenniBot')
            .setFooter(song.url)
            .addFields({
            name: 'Stopped playing ' + song.title,
            value: 'Left the Voice Channel',
            inline: true,
        });
        return stopped;
    }
};
