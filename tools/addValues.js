import 'dotenv/config';
import { prompts, createPrompt, findPrompt } from '../src/db/client.js';

await prompts.deleteMany({});

await createPrompt({
    regex: /^[\s\S]*attack[\s\S]*$/,
    actions: [
        {
            action: 'damageOpponent',
            type: 'userAttack',
            variable: 'hpLost',
            goto: {
                fail: 3
            }
        },
        {
            action: 'addMessage',
            content: '{{user}} attacked {{opponent}} and lost {{c:hpLost}} HP.'
        },
        {
            action: 'stop'
        },
        {
            action: 'addMessage',
            content: '{{user}} attempted to attack {{opponent}} but failed.'
        }
    ]
});

console.log('Done.');

/* await createPrompt({
    regex: /^[\s\S]*YOUR_VALUE[\s\S]*$/,
    response: [{
        action: 'createMessage',
        content: 'test'
    }]
});

console.log(
    await findPrompt('YOUR_VALUE', { user: '<@!ID>', opponent: '<@!ID>' })
); */