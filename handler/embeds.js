const Discord = require('discord.js');
const {
	color,
} = require('../config.json');

module.exports = {
    name: 'embeds',
    playing(song) {
        const minutes = Math.floor(song.duration / 60);
        const seconds = song.duration - minutes * 60;

        const playing = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle('BenniBot');
        if (minutes === 0 && seconds === 0) {
            playing.setFooter('Live');
        } else {
            playing.setFooter(minutes + 'm ' + seconds + 's');
        }
        playing.addFields({
                name: 'Now playing: ',
                value: song.title + "\n" + song.url,
                inline: false,
            })
            .setThumbnail(song.thumbnail);
        return playing;
    },
    stopped(song) {
        const stopped = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle('BenniBot')
        .setFooter(song.url)
        .setTimestamp()
        .addFields({
            name: 'Stopped playing ' + song.title,
            value:  'Left the Voice Channel',
            inline: true,
        });
        return stopped;
    }
};