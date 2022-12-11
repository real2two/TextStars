import { client } from '../main/bot.js';
import { duels } from '../func/data.js';
import { findPrompt } from '../db/client.js';

client.on('messageCreate', async msg => {
    if (msg.member.user.bot) return;
    
    const Duel = Object.entries(duels).find(([ k, v ]) => k.startsWith(`${msg.guildID}:`) && v.channel === msg.channel.id);
    if (!Duel) return;
    
    const duel = Duel[1];
    //if (!duel.fighters.find(u => u.id === msg.member.user.id)) return;
    if (msg.member.user.id !== duel.info.turn) return;

    const user = duel.fighters.find(u => u.id === duel.info.turn);
    const opponent = duel.fighters.find(u => u.id !== duel.info.turn) || user;

    duel.info.turn = null;

    const prompt = await findPrompt(msg.content, { duel, user, opponent });
    if (!prompt) {
        try {
            duel.info.turn = user.id;
            return msg.addReaction('❌');
        } catch(err) {
            return console.error(err);
        }
    } else {
        try {
            msg.addReaction('✅');
        } catch(err) {
            console.error(err);
        }
    }

    clearTimeout(duel.timer);

    const userHp = duel.data.find(u => u.id === user.id).hp;
    const opponentHp = duel.data.find(u => u.id === opponent.id).hp;
    if (userHp <= 0 || opponentHp <= 0) {
        let winnerPrompt;
        if (userHp <= 0 && opponentHp <= 0) {
            winnerPrompt = 'It\'s a tie!';
        } else if (userHp <= 0) {
            winnerPrompt = `<@!${opponent.id}> won the duel!`;
        } else if (opponentHp <= 0) {
            winnerPrompt = `<@!${user.id}> won the duel!`;
        }
        
        delete duels[duel.id];

        try {
            await duel.editPrevious();
            await client.createMessage(msg.channel.id, {
                embeds: [{
                    ...duel.generateEmbedTemplate(),
                    color: 0x57F287,
                    thumbnail: { url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/crown_1f451.png' },
                    description: `${prompt.content}\n\n${winnerPrompt}`
                }]
            });
        } catch(err) {
            console.error(err);
        }
        return;
    }

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

    duel.info.turn = opponent.id;

    const embed = {
        ...duel.generateEmbedTemplate(),
        thumbnail: { url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/53/crossed-swords_2694.png' },
        description: `${prompt.content}\n\n` +
                     `It's now <@!${duel.info.turn}>'s turn.\n` +
                     `<@!${duel.info.turn}> has to use a move <t:${((Date.now() + 30000) / 1000) | 0}:R>.`,
    };

    try {
        await duel.editPrevious();
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