import { client } from '../main/bot.js';

import * as challengeRequest from '../interactions/challengeRequest.js';
import * as challengeBegin from '../interactions/challengeBegin.js';

client.on('interactionCreate', async interaction => {
    switch(interaction.type) {
        case 2:
            if (interaction.data.type === 1 && interaction.data.name === 'challenge' ||
                interaction.data.type === 2 && interaction.data.name === 'Challenge user') {
                return challengeRequest.execute(interaction);
            }
            break;
        case 3:
            if (interaction.data.custom_id.startsWith('challenge-')) {
                if (client.startTime > interaction.message.timestamp) {
                    return interaction.createMessage({
                        flags: 64,
                        content: 'The request has expired.'
                    });
                } else {
                    return challengeBegin.execute(interaction);
                }
            }
            break;
    }
});