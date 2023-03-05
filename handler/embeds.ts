import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';

type song = {
    duration: number;
    title: string;
    url: string;
    thumbnail: string;
};

export function PlayingEmbed(song: song, volume: number) {
    const minutes = Math.floor(song.duration / 60);
    const seconds = song.duration - minutes * 60;
    let durationString = '';

    if (minutes === 0 && seconds === 0) {
        durationString = 'Live';
    } else if (minutes === 0 && seconds > 0) {
        durationString = `${seconds}s`;
    } else if (minutes > 0 && seconds === 0) {
        durationString = `${minutes}m 00s`;
    } else {
        durationString = `${minutes}m ${seconds}s`;
    }

    return new EmbedBuilder()
        .setAuthor({
            name: 'Now playing',
        })
        .setTitle(song.title)
        .setDescription(`Volume: ${volume}\nDuration: ${durationString}`)
        .setURL(song.url)
        .setColor(Colors.Green)
        .setThumbnail(song.thumbnail);
}

export function StoppedEmbed(song?: song) {
    if (song != undefined) {
        return new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('Stopped playing')
            .setDescription(`[${song.title}](${song.url})`);
    }
    return new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Stopped playing')
        .setDescription(`Leaving the Voice Channel`);
}

export function PingEmbed(botLatency: number, wsLatency: number) {
    return new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('Pong! :ping_pong:')
        .addFields(
            {
                name: 'Bot Latency ||Amount it takes for a response from the Bot||',
                value: `${botLatency} ms`,
            },
            {
                name: 'Websocket Latency ||Latency between Bot and Server||',
                value: `${wsLatency} ms`,
            }
        );
}
