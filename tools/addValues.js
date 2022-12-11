import 'dotenv/config';
import { prompts, createPrompt, createPrompts, findPrompt } from '../src/db/client.js';

await prompts.deleteMany({});

await createPrompts(
    {
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
    },
    {
        regex: /^[\s\S]*marry[\s\S]*$/,
        actions: [
            {
                action: 'randomChance',
                chance: 50,
                goto: {
                    fail: 4
                }
            },
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'def',
                value: [ -2, -1 ],
                variable: 'defenseLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} hugged {{opponent}}.\n{{opponent}}\'s DEF decreased by {{c:defenseLost}}.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [ -3, -1 ],
                variable: 'hpLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} tried to hug {{opponent}} but got rejected and lost {{c:hpLost}} HP.'
            }
        ]
    }
);

/*
{
    action: 'modifyStats',
    who: 'user' || 'opponent',
    type: 'hp' || 'atk' || 'def' || 'acc',
    value: [ min_number, max_number ],
    variable: string
}
{
    action: 'randomChance',
    chance: 0-100, // decimals work
    goto: {
        success: goto,
        fail: goto
    }
}
*/

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