// import { client } from '../main/bot.js';
import getHouse from '../func/getHouse.js';
import { requests, duels } from '../game/data.js';

export async function execute(interaction) {
    let userId;
    if (interaction.data.type === 1 && interaction.data.options) {
        userId = interaction.data.options.find(o => o.name === 'player').value;
    } else if (interaction.data.type === 2) {
        userId = interaction.data.target_id;
    }

    const requestingUser = { ...interaction.member.user };
    const challengedUser = { ...interaction.data.resolved.users.get(userId) };

    requestingUser.team = getHouse(requestingUser.publicFlags);
    challengedUser.team = getHouse(challengedUser.publicFlags);

    if (!requestingUser) {
        return interaction.createMessage({
            flags: 64,
            content: 'You must be in a Hypesquad team to use this bot. Learn more at https://support.discord.com/hc/en-us/articles/360007553672-HypeSquad-House-Breakdown'
        });
    }

    // if (requestingUser.id === challengedUser.id) return interaction.createMessage({
    //     flags: 64,
    //     content: 'You can\'t fight yourself.'
    // });

    if (challengedUser.bot) return interaction.createMessage({
        flags: 64,
        content: 'You can\'t fight a bot.'
    });

    if (!challengedUser.team) {
        return interaction.createMessage({
            flags: 64,
            content: 'The requested challenger must be in a Hypesquad team. Learn more at https://support.discord.com/hc/en-us/articles/360007553672-HypeSquad-House-Breakdown'
        });
    }

    if (Object.keys(duels).find(r => r.startsWith(`${interaction.guildID}:`) && r.includes(`${requestingUser.id}:`))) return interaction.createMessage({
        flags: 64,
        content: 'You are already in a duel.'
    });

    if (Object.keys(duels).find(r => r.startsWith(`${interaction.guildID}:`) && r.includes(`${challengedUser.id}:`))) return interaction.createMessage({
        flags: 64,
        content: 'This requested challenger is already in a duel.'
    });

    const challengeId = `${interaction.guildID}:${requestingUser.id}:${challengedUser.id}`;

    if (requests[challengeId]) return interaction.createMessage({
        flags: 64,
        content: 'You already requested to challenge this user recently.'
    });

    if (requests[`${interaction.guildID}:${challengedUser.id}:${requestingUser.id}`]) return interaction.createMessage({
        flags: 64,
        content: 'The requested challenger already requested to challenge you. Click \`Accept Challenge\` instead!'
    });

    if (Object.entries(duels).find(([ k, v ]) => k.startsWith(`${interaction.guildID}:`) && v.channel === interaction.channel.id)) return interaction.createMessage({
        flags: 64,
        content: 'Failed to request to duel. There is an ongoing duel in the current channel.'
    });

    const embed = {
        color: 0x5865F2,
        author: {
            name: `${requestingUser.username} challenges ${challengedUser.username} to a duel!`,
            icon_url: interaction.member.user.avatarURL
        },
        description: `Do you accept the challenge? You have <t:${((Date.now() + 60000) / 1000) | 0}:R> to accept.`
    };

    requests[challengeId] = {
        users: [ requestingUser, challengedUser ],
        embed,
        timeout: setTimeout(async () => {
            delete requests[challengeId];
            await interaction.editOriginalMessage({
                embeds: [ { ...embed, color: 0xED4245, description: 'The request has expired.' } ],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 3,
                        custom_id: `challenge-${challengeId}`,
                        label: 'Accept challenge',
                        disabled: true
                    }]
                }]
            });
        }, 60000)
    }

    await interaction.createMessage({
        content: `||<@!${challengedUser.id}>||`,
        embeds: [ embed ],
        components: [{
            type: 1,
            components: [{
                type: 2,
                style: 3,
                custom_id: `challenge-${challengeId}`,
                label: 'Accept challenge'
            }]
        }]
    });
}