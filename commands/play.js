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
var voice_1 = require("@discordjs/voice");
var ytdl_core_discord_1 = __importDefault(require("ytdl-core-discord"));
var ytsr_1 = __importDefault(require("ytsr"));
var chalk_1 = __importDefault(require("chalk"));
var embeds = require('../handler/embeds');
var logger = require('../handler/VoiceStateLogger');
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName('play')
        .setDescription('Joins your current Voice Channel and starts playing your selected music')
        .addStringOption(function (option) {
        return option.setName('url')
            .setDescription('YouTube URL or Name of the Song')
            .setRequired(true);
    })
        .addStringOption(function (option) {
        return option.setName('volume')
            .setDescription('Volume of the Song');
    })
        .addStringOption(function (option) {
        return option.setName('loop')
            .setDescription('Loop the Song');
    }),
    execute: function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var targetsong, YoutubeCheckPattern, YoutubeCheck, songData, song_1, error_1, resultId, error_2, connection_1, stream, volume, player, resource, playing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        interaction.deferReply();
                        if (!interaction.member.voice.channel) return [3 /*break*/, 11];
                        targetsong = interaction.options.getString('url');
                        YoutubeCheckPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
                        YoutubeCheck = YoutubeCheckPattern.test(interaction.options.getString('url'));
                        songData = null;
                        song_1 = null;
                        if (!YoutubeCheck) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ytdl_core_discord_1.default.getInfo(interaction.options.getString('url'))];
                    case 2:
                        songData = _a.sent();
                        song_1 = {
                            title: songData.videoDetails.title,
                            url: songData.videoDetails.video_url,
                            duration: songData.videoDetails.lengthSeconds,
                            thumbnail: songData.videoDetails.thumbnails[3].url,
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(Error);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        _a.trys.push([5, 8, , 9]);
                        return [4 /*yield*/, (0, ytsr_1.default)(targetsong, { "limit": 1 })];
                    case 6:
                        resultId = (_a.sent()).items[0]["url"].split("=");
                        return [4 /*yield*/, ytdl_core_discord_1.default.getInfo(resultId[1])];
                    case 7:
                        songData = _a.sent();
                        song_1 = {
                            title: songData.videoDetails.title,
                            url: songData.videoDetails.video_url,
                            duration: songData.videoDetails.lengthSeconds,
                            thumbnail: songData.videoDetails.thumbnails[3].url,
                        };
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 9];
                    case 9:
                        connection_1 = (0, voice_1.joinVoiceChannel)({
                            channelId: interaction.member.voice.channel.id,
                            guildId: interaction.member.guild.id,
                            adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
                        });
                        return [4 /*yield*/, (0, ytdl_core_discord_1.default)(song_1.url, {
                                highWaterMark: 1 << 25,
                                filter: 'audioonly',
                                quality: 'highestaudio',
                            })];
                    case 10:
                        stream = _a.sent();
                        volume = interaction.options.getString('volume') ? interaction.options.getString('volume') : '0.5';
                        player = (0, voice_1.createAudioPlayer)();
                        resource = (0, voice_1.createAudioResource)(stream, { inputType: voice_1.StreamType.Opus, inlineVolume: true, });
                        resource.volume.setVolume(volume);
                        connection_1.subscribe(player);
                        player.play(resource);
                        // Execute the VoiceStateLogger to log the current state of the player when DevMode is true
                        if (process.env.DEV_MODE === "true") {
                            logger.execute(connection_1, player);
                        }
                        if (song_1) {
                            console.log('[Play] ' + chalk_1.default.gray("" + song_1.title) + ' on ' + chalk_1.default.gray("" + interaction.guild.name) + ' by ' + chalk_1.default.gray("" + interaction.member.user.username));
                        }
                        playing = embeds.playing(song_1, volume);
                        interaction.editReply({ embeds: [playing] });
                        player.on(voice_1.AudioPlayerStatus.Idle, function () {
                            console.log('[AutoStop] on "' + interaction.guild.name + '"');
                            var stopped = embeds.stopped(song_1);
                            interaction.followUp({ embeds: [stopped] });
                            connection_1.destroy();
                        });
                        return [3 /*break*/, 12];
                    case 11:
                        interaction.reply({ content: 'You need to join a Voice Channel first!', allowedMentions: { repliedUser: true } });
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    },
};
