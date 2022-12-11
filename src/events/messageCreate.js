import { client } from '../main/bot.js';
import { duels } from '../func/data.js';

client.on('messageCreate', async msg => {
    if (msg.member.user.bot) return;
    
    const Duel = Object.entries(duels).find(([ k, v ]) => k.startsWith(`${msg.guildID}:`) && v.channel === msg.channel.id);
    if (!Duel) return;
    
    const duel = Duel[1];
    if (!duel.fighters.find(u => u.id === msg.member.user.id)) return;

    /* FORMULAS (work on game logic!)
        - r_att = att + Math.floor(Math.random() * 5) - 2; // the attack value can only be a value inbetween (atk - 2) to (atk + 2) 
        - damage = r_atk * r_atk / (r_atk + def) */

    clearTimeout(duel.timer);
    duel.timer = setTimeout(async () => {
        try {
            delete duels[duel.id];
            await duel.editPrevious();
            await client.createMessage(msg.channel.id, {
                embeds: [{
                    ...duel.generateEmbedTemplate(),
                    color: 0x57F287,
                    thumbnail: { url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/crown_1f451.png' },
                    description: `<@!${duel.info.turn}> failed to use a move within 30 seconds.\n\n` +
                                 `<@!${duel.fighters.find(u => u.id !== duel.info.turn) ? duel.fighters.find(u => u.id !== duel.info.turn).id : duel.info.turn}> wins!`
                }]
            });
        } catch(err) {
            console.error(err);
        }
    }, 30000);

    duel.info.turn = duel.fighters.find(u => u.id !== duel.info.turn) ? duel.fighters.find(u => u.id !== duel.info.turn).id : duel.info.turn;

    const embed = {
        ...duel.generateEmbedTemplate(),
        thumbnail: { url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/53/crossed-swords_2694.png' },
        description: 'test\n\n' +
                     `It's now <@!${duel.info.turn}>'s turn.\n` +
                     `<@!${duel.info.turn}> has to use a move <t:${((Date.now() + 30000) / 1000) | 0}:R>.`,
    };

    await duel.editPrevious();

    try {
        const message = await client.createMessage(msg.channel.id, { embeds: [ embed ] });
        duel.editPrevious = () => message.edit({
            embeds: [{
                ...embed,
                description: embed.description.slice(0, -embed.description.split('\n')[embed.description.split('\n').length - 1].length - 1)
            }]
        });
    } catch(err) {
        console.error(err);
        duel.editPrevious = () => true;
    }
});