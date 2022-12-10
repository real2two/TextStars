import { client } from '../main/bot.js';

import * as challengeRequest from '../interactions/challengeRequest.js';

client.on('interactionCreate', async interaction => {
    switch(interaction.type) {
        case 2:
            if (interaction.data.type === 1 && interaction.data.name === 'challenge' ||
                interaction.data.type === 2 && interaction.data.name === 'Challenge user') {
                return challengeRequest.execute(interaction);
            }
            break;
    }
});