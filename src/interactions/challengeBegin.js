import { requests, duels } from '../game/data.js';

export async function execute(interaction) {
    const challengeId = interaction.data.custom_id.slice('challenge-'.length);
    const [ _guildId, _requestedUserId, challengedUserId ] = challengeId.split(':');

    if (interaction.member.user.id !== challengedUserId) return interaction.createMessage({
        flags: 64,
        content: 'You aren\'t the requested challenger.'
    });

    if (Object.keys(duels).find(r => r.startsWith(`${interaction.guildID}:`) && r.includes(`${challengedUserId}:`))) return interaction.createMessage({
        flags: 64,
        content: 'You are already in a duel.'
    });

    if (Object.entries(duels).find(([ k, v ]) => k.startsWith(`${interaction.guildId}:`) && v.channel === interaction.channel.id)) return interaction.createMessage({
        flags: 64,
        content: 'Failed to start duel. There is an ongoing duel in the current channel.'
    });

    const request = requests[challengeId];
    if (!request || duels[challengeId]) return interaction.createMessage({ content: 'An unexpected error has occured.' });

    clearTimeout(request.timeout);
    delete requests[challengeId];
    
    const requestedUser = request.users[0];
    const challengedUser = request.users[1];

    const data = [];
    for (const { id, team } of request.users) {
        switch (team) {
            case 'bravery':
                data.push({
                    id,
                    hp: 100, // health
                    atk: 15, // attack
                    def: 0, // defense
                    acc: 50 // accuracy (%)
                });
                break;
            case 'brilliance':
                data.push({
                    id,
                    hp: 100,
                    atk: 7,
                    def: 2,
                    acc: 90
                });
                break;
            case 'balance':
                data.push({
                    id,
                    hp: 100,
                    atk: 10,
                    def: 5,
                    acc: 80
                });
                break;
        }
    }

    const duel = {
        channel: interaction.channel.id,
        fighters: request.users,
        info: {
            turn: Math.floor(Math.random() * 2) ? requestedUser.id : challengedUser.id
        },
        data
    };

    duels[challengeId] = duel;

    await interaction.editParent({
        embeds: [ { ...request.embed, color: 0x57F287, description: 'Challenge accepted!' } ],
        components: [{
            type: 1,
            components: [
                {
                    type: 2,
                    style: 3,
                    custom_id: `challenge-${challengeId}`,
                    label: 'Accept challenge',
                    disabled: true
                }
            ]
        }]
    });

    await interaction.createMessage({
        embeds: [{
            color: 0xFEE75C,
            author: {
                name: `${requestedUser.username} vs ${challengedUser.username}`
            },
            thumbnail: { url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/53/crossed-swords_2694.png' },
            description: `${requestedUser.team === challengedUser.team ?
                            `A duel between two Hypesquad ${requestedUser.team.slice(0, 1).toUpperCase() + requestedUser.team.slice(1)} members began.` : 
                            `A duel between a Hypesquad ${requestedUser.team.slice(0, 1).toUpperCase() + requestedUser.team.slice(1)} member and a Hypesquad ${challengedUser.team.slice(0, 1).toUpperCase() + challengedUser.team.slice(1)} member began.`}\n\n` +
                         `The match begins with <@!${duel.info.turn}>'s turn.`,
            fields: [
                {
                    name: 'Status',
                    value: `**<@!${requestedUser.id}>'s HP**: ${duel.data.find(({ id }) => id === requestedUser.id).hp}\n` +
                           `**<@!${challengedUser.id}>'s HP**: ${duel.data.find(({ id }) => id === challengedUser.id).hp}\n`
                }
            ],
            footer: { text: 'Confused? Send a message to start dueling. (eg. attack, defend, heal, move, etc.)' }
        }]
    });
}