import { client } from '../main/bot.js';
import { duels } from '../game/data.js';

client.on('messageCreate', async msg => {
    if (msg.member.user.bot) return;
    
    const duel = Object.entries(duels).find(([ k, v ]) => k.startsWith(`${msg.guildID}:`) && v.channel === msg.channel.id)[1];
    if (!duel) return;
    if (!duel.fighters.find(u => u.id === msg.member.user.id)) return;

    try {
        client.createMessage(msg.channel.id, 'test');
    } catch(err) {
        console.error(err);
    }
});