import 'dotenv/config';
import Eris from 'eris';

export const client = new Eris(process.env.TOKEN);

client.once('ready', async () => {
    console.log(
        await client.bulkEditCommands([
            {
                type: 1,
                name: 'challenge',
                description: 'Challenge somebody to a duel!',
                options: [
                    {
                        type: 6,
                        name: 'player',
                        description: 'The player you want to challenge.',
                        required: true
                    }
                ],
                dm_permission: false
            },
            {
                type: 2,
                name: 'Challenge user'
            }
        ])
    );
    return process.exit();
});

client.connect();