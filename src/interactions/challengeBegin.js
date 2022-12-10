import { requests } from '../game/requests.js';

export async function execute(interaction) {
    const challengeId = interaction.data.custom_id.slice('challenge-'.length).split(':');
    const [ _guildId, requestedUserId, challengedUserId ] = challengeId;

    if (interaction.member.user.id !== challengedUserId) return interaction.createMessage({
        flags: 64,
        content: 'You aren\'t the requested challenger.'
    });

    if (!requests[challengeId]) return interaction.createMessage({
        content: 'An unexpected error has occured.'
    });
    
    clearTimeout(requests[challengeId]);
    delete requests[challengeId];
    
    interaction.createMessage({
        embeds: [{
            description: `<@!${requestedUserId}> vs <@!${challengedUserId}>`
        }]
    });
}