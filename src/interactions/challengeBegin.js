import { requests, duels } from '../game/data.js';

export async function execute(interaction) {
    const challengeId = interaction.data.custom_id.slice('challenge-'.length);
    const [ _guildId, _requestedUserId, challengedUserId ] = challengeId.split(':');

    if (interaction.member.user.id !== challengedUserId) return interaction.createMessage({
        flags: 64,
        content: 'You aren\'t the requested challenger.'
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

    duels[challengeId] = {
        users: request.users,
        data
    };

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
            description: `<@!${requestedUser.id}> vs <@!${challengedUser.id}>`
        }]
    });
}