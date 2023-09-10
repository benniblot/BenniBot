import { Colors, EmbedBuilder } from 'discord.js';

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
            .setAuthor({ name: 'Stopped playing' })
            .setTitle(song.title)
            .setURL(song.url)
            .setColor(Colors.Red)
            .setThumbnail(song.thumbnail);
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
                name: 'Bot Latency ||Time it takes for a response from the Bot||',
                value: `${botLatency} ms`,
            },
            {
                name: 'Websocket Latency ||Latency between Bot and Server||',
                value: `${wsLatency} ms`,
            }
        );
}

export function SupportedPlatformsEmbed() {
    return new EmbedBuilder()
        .setAuthor({
            name: 'BenniBlot',
            iconURL:
                'https://cdn.discordapp.com/avatars/692296016182902814/98c42fef88491ef6f30692964968a7af?size=1024',
        })
        .setTitle('Supported Platforms')
        .setDescription(
            '- Youtube (Youtube Music)\n- AppleMusic (Itunes)\n- Spotify\n- Deezer\n- Tidal\n- AmazonMusic'
        )
        .setColor(0xffffff);
}
