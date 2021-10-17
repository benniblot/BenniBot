"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var builders_1 = require("@discordjs/builders");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var ytdl_core_discord_1 = __importDefault(require("ytdl-core-discord"));
var voice_1 = require("@discordjs/voice");
var simple_youtube_api_1 = __importDefault(require("simple-youtube-api"));
var youtube = new simple_youtube_api_1.default(process.env.api_key);
var time = require('../handler/time.js');
var embeds = require('../handler/embeds.js');
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName('play')
        .setDescription('Joins your current Voice Channel and starts playing your selected music')
        .addStringOption(function (option) {
        return option.setName('url')
            .setDescription('YouTube URL or Name of the Song')
            .setRequired(true);
    }),
    execute: function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var targetsong, YoutubeCheckPattern, YoutubeCheck, songData, song_1, error_1, connection_1, stream, player, resource, _a, h, mi, s, d, mo, y, playing;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        interaction.deferReply();
                        if (!interaction.member.voice.channel) return [3 /*break*/, 8];
                        targetsong = interaction.options.getString('url');
                        YoutubeCheckPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
                        YoutubeCheck = YoutubeCheckPattern.test(interaction.options.getString('url'));
                        songData = null;
                        song_1 = null;
                        if (!YoutubeCheck) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ytdl_core_discord_1.default.getInfo(interaction.options.getString('url'))];
                    case 2:
                        songData = _b.sent();
                        song_1 = {
                            title: songData.videoDetails.title,
                            url: songData.videoDetails.video_url,
                            duration: songData.videoDetails.lengthSeconds,
                            thumbnail: songData.videoDetails.thumbnails[3].url,
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error(Error);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        try {
                            // const result = await ytsr('lofi hip hop', { limit : 1 })
                            // console.log(result.items[0].type)
                            // const result = await youtube.searchVideos(targetsong, 1);
                            // songData = await ytdl.getInfo('asdf');
                            /* song = {
                                title: songData.videoDetails.title,
                                url: songData.videoDetails.video_url,
                                duration: songData.videoDetails.lengthSeconds,
                                thumbnail: songData.videoDetails.thumbnails[3].url,
                            };*/
                            interaction.deferReply();
                            interaction.editReply({ content: 'Pong again!' });
                        }
                        catch (error) {
                            console.log(error);
                        }
                        _b.label = 6;
                    case 6:
                        connection_1 = (0, voice_1.joinVoiceChannel)({
                            channelId: interaction.member.voice.channel.id,
                            guildId: interaction.member.guild.id,
                            adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
                        });
                        return [4 /*yield*/, (0, ytdl_core_discord_1.default)(song_1 === null || song_1 === void 0 ? void 0 : song_1.url, {
                                highWaterMark: 1 << 25,
                                filter: 'audioonly',
                            })];
                    case 7:
                        stream = _b.sent();
                        player = (0, voice_1.createAudioPlayer)();
                        resource = (0, voice_1.createAudioResource)(stream, { inputType: voice_1.StreamType.Opus });
                        connection_1.subscribe(player);
                        player.play(resource);
                        connection_1.on('stateChange', function (oldState, newState) {
                            console.log("Connection transitioned from " + oldState.status + " to " + newState.status);
                        });
                        player.on('stateChange', function (oldState, newState) {
                            console.log("Audio player transitioned from " + oldState.status + " to " + newState.status);
                        });
                        _a = time.execute(), h = _a[0], mi = _a[1], s = _a[2], d = _a[3], mo = _a[4], y = _a[5];
                        if (song_1) {
                            console.log('[' + d + '-' + mo + '-' + y + ' ' + h + ':' + mi + ':' + s + '] ' + interaction.guild.name + ': playing - ' + song_1.title);
                        }
                        playing = embeds.playing(song_1);
                        interaction.editReply({ embeds: [playing] });
                        player.on(voice_1.AudioPlayerStatus.Idle, function () {
                            var _a = time.execute(), h = _a[0], mi = _a[1], s = _a[2], d = _a[3], mo = _a[4], y = _a[5];
                            console.log('[' + d + '-' + mo + '-' + y + ' ' + h + ':' + mi + ':' + s + '] ' + interaction.guild.name + ': Stopped playing and left');
                            var stopped = embeds.stopped(song_1);
                            interaction.followUp({ embeds: [stopped] });
                            connection_1.destroy();
                        });
                        return [3 /*break*/, 9];
                    case 8:
                        interaction.editReply({ content: 'You need to join a Voice Channel first!', allowedMentions: { repliedUser: true } });
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
};
