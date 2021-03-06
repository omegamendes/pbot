import { Handler } from './Handler'
import { VoiceChannel, VoiceConnection, Message } from 'discord.js';
import { Logger } from "../conf/Logger";
import { Readable } from 'stream'

import googleTTS = require('google-tts-api');
import fetch = require("node-fetch");

export class DropZoneHandler extends Handler {

    constructor(command: string) {
        super(command, false);
    }

    async handler(msg: Message) {
        if (!this.validate(msg)) return;

        const voiceChannel: VoiceChannel = msg.member.voice.channel;

        if (!voiceChannel) {
            Logger.log("User is not on a voice channel")
            return;
        }

        this.sortAndSend(voiceChannel);
    }

    async sortAndSend(voiceChannel: VoiceChannel) {
        const zones = ['Represa do pinherinho', 'Congonhas', 'Pedreira', 'Armazens ao lado do mercadão', 'Mercadão municipal', 'Estádio da Ferrinha', 
        'Lumber', 'Centro da cidade', 'Promenade West', 'Promenade East', 'Estação de Trem', 'Hospital São Paulo', 
        'Hills', 'TV Record', 'Parque infantil', 'Porto de Santos', 'Carandiru',
        'Fazenda', 'Cemitério Municipal']

        let zone = this.shuffle(zones)

        const url = await googleTTS(zone, 'pt-br', 1);
        let response = await fetch(url);
        const readable = new Readable()
        readable._read = () => {}
        readable.push(await response.buffer())
        readable.push(null)

        voiceChannel.join().then(async (vc: VoiceConnection) => {
            const dispatcher = vc.play(readable, { volume: 1 });
            dispatcher.on("finish", () => voiceChannel.leave());
        }).catch(error => {
            Logger.error(error, "Error message");
            voiceChannel.leave();
        });
    }

    private shuffle(array: any) {
        array.sort(() => Math.random() - 0.5);

        let str1 = Buffer.from("Qm9semFu", 'base64').toString('utf-8')

        const messages = [`Se não cair em ${array[0]} é corno.`,
		`O Guinão não está jogando porque está sendo refém na ${array[0]} , salvem ele.`,
		`Se o Filipe autista estivesse aqui, ele falaria para caírem em ${array[0]}.`,
        `O ultimo a cair em ${array[0]} vai chupar o saco do p poli.`,
        `Se não quiser ter bolinha no pau, caia em ${array[0]}.`,
        `Segue a call e cai em ${array[0]} se não você vai trabalhar com o 08.`,
        `Nessa rodada, não sigam as calls do corno do Mendes, caiam em  ${array[0]}.`,
        `${str1} resolveu comprar o ${array[0]} , vá checar o terreno.`,
        `Sim, vamos cair em ${array[0]}, la a probabilidade de vitória é alta` ];

        messages.sort(() => Math.random() - 0.5); 
        return messages[0]
    }
}