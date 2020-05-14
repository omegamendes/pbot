import Discord, {Message, VoiceState, VoiceChannel } from 'discord.js';
import { Env } from './conf/Env';
import { Logger } from './conf/Logger';
import { PingHandler, FileHandler, YoutubeHandler, SoundHandler, JsonMessageHandler, VoiceHandler, DropZoneHandler,
         ChatCleanerHandler, ImageSearchHandler, GenericVoiceHandler} from './handler/';

export class DiscordServer {

    // TODO query for sending audio and message to avoid various problems...

    client: Discord.Client;
    prefix: string = '!';

    constructor() {
        this.client = new Discord.Client();
        this.setHandlers();
        this.client.login(Env.discordToken());
        Logger.log("Server started with success");
    }    

    setHandlers() {
        this.client.on('ready', () => {
            Logger.log(`Logged in as ${this.client.user?.tag}!`);
        });

        const pingHandler: PingHandler = new PingHandler("!ping");
        const fileHandler: FileHandler = new FileHandler("!file");
        const yotubeHandler: YoutubeHandler = new YoutubeHandler("!yt");
        const soundHandler: SoundHandler = new SoundHandler("!sd");
        const jsonMessageHandler: JsonMessageHandler = new JsonMessageHandler("!msg");
        const voiceHandler: VoiceHandler = new VoiceHandler("!voice");
        const voiceDropZoneHandler: DropZoneHandler = new DropZoneHandler("!zone");
        const chatCleanerHandler: ChatCleanerHandler = new ChatCleanerHandler("!clean");
        const imageSearchHandler: ImageSearchHandler = new ImageSearchHandler("!img");
        const genericVoiceHandler: GenericVoiceHandler = new GenericVoiceHandler("!mlvoice");

        this.client.on('voiceStateUpdate', (oldMember: VoiceState, newMember: VoiceState) => {	
            if (oldMember.member.id === this.client.user.id) return; // avoid bot self message in a infint loop	

            let newUserChannel: VoiceChannel = newMember.channel	
            let oldUserChannel: VoiceChannel = oldMember.channel	

            if(oldUserChannel === null && newUserChannel !== null) {	
                voiceHandler.convertAndSend(`${newMember.member.user.username} entrou`, newUserChannel)	
            } else if(newUserChannel === null){	
                voiceHandler.convertAndSend(`${newMember.member.user.username} saiu`, oldUserChannel)	
            }	
        });

        this.client.on('message', (msg: Message) => {    
            if (!msg.content.startsWith(this.prefix) || msg.author.bot) return
            
            pingHandler.handler(msg);
            fileHandler.handler(msg);
            yotubeHandler.handler(msg);
            soundHandler.handler(msg);
            jsonMessageHandler.handler(msg);
            voiceHandler.handler(msg);
            voiceDropZoneHandler.handler(msg);
            chatCleanerHandler.handler(msg);
            imageSearchHandler.handler(msg);
            genericVoiceHandler.handler(msg);

        });
        
    }

}
