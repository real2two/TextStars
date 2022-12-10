import { requests } from '../game/requests.js';

export async function execute(interaction) {
    const challengeId = interaction.data.custom_id.slice('challenge-'.length);
    const [ _guildId, requestedUserId, challengedUserId ] = challengeId.split(':');

    if (interaction.member.user.id !== challengedUserId) return interaction.createMessage({
        flags: 64,
        content: 'You aren\'t the requested challenger.'
    });

    const request = requests[challengeId];
    if (!request) return interaction.createMessage({
        content: 'An unexpected error has occured.'
    });
    
    clearTimeout(request.timeout);
    delete requests[challengeId];

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
            description: `<@!${requestedUserId}> vs <@!${challengedUserId}>`
        }]
    });
}