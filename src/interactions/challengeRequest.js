// import { client } from '../main/bot.js';
import { requests } from '../game/requests.js';

const date = new Date();

export async function execute(interaction) {
    let userId;
    if (interaction.data.type === 1 && interaction.data.options) {
        userId = interaction.data.options.find(o => o.name === 'player').value;
    } else if (interaction.data.type === 2) {
        userId = interaction.data.target_id;
    }

    const requestingUser = interaction.member.user;
    const challengedUser = interaction.data.resolved.users.get(userId);

    if (requestingUser.id === challengedUser.id) return interaction.createMessage('You can\'t fight yourself.');
    if (challengedUser.bot) return interaction.createMessage('You can\'t fight a bot.');

    // interaction.createMessage('This player is already in a duel.');

    const embed = {
        author: {
            name: `${requestingUser.username} challenges ${challengedUser.username} to a duel!`,
            icon_url: requestingUser.avatarURL
        },
        description: `Do you accept the challenge? You have <t:${((date.getTime() + 60000) / 1000) | 0}:R> to accept.`
    };

    const expiredTimeout = setTimeout(async () => {
        await interaction.editOriginalMessage({
            embeds: [ { ...embed, description: 'The request has expired.' } ],
            components: [{
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 3,
                        custom_id: 'challenge_accept',
                        label: 'Accept challenge',
                        disabled: true
                    }
                ]
            }]
        });
    }, 60000);

    await interaction.createMessage({
        content: `||<@!${challengedUser.id}>||`,
        embeds: [ embed ],
        components: [{
            type: 1,
            components: [
                {
                    type: 2,
                    style: 3,
                    custom_id: 'challenge_accept',
                    label: 'Accept challenge'
                }
            ]
        }]
    });

    console.log(interaction);
    clearInterval(expiredTimeout);
}