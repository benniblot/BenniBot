import Discord from 'discord.js'

module.exports = {
    name: 'embeds',
    playing(song: { duration: number; title: string; url: string; thumbnail: any; }, volume) {
        const minutes = Math.floor(song.duration / 60);
        const seconds = song.duration - minutes * 60;

        const playing = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('BenniBot');
        if (minutes === 0 && seconds === 0) {
            playing.setFooter({text: 'Live'});
        } else if (minutes === 0 && seconds > 0) {
            playing.setFooter({text: seconds + 's'});
        } else if (minutes > 0 && seconds === 0) {
            playing.setFooter({text: minutes + 'm'});
        } else {
            playing.setFooter({text: minutes + 'm ' + seconds + 's'});
        }
        playing.addFields({
                name: 'Now playing: ',
                value: song.title + "\n" + song.url + "\nVolume: " + volume,
                inline: false,
            })
            .setThumbnail(song.thumbnail);
        return playing;
    },
    stopped(song: { url: any; title: string; }) {
        const stopped = new Discord.MessageEmbed()
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