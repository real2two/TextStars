import 'dotenv/config';
import { prompts, createPrompt, createPrompts, findPrompt } from '../src/db/client.js';

await prompts.deleteMany({});

const unparsedPrompts = [
    { // attack
        value: 'attack',
        actions: [
            {
                action: 'damageOpponent',
                type: 'userAttack',
                variable: 'hpLost',
                goto:
                {
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
        ],
        prodigy: 1
    },
    { // marry
        value: 'marry',
        actions: [
            {
                action: 'randomChance',
                chance: 50,
                goto:
                {
                    fail: 5
                }
            },
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'def',
                value: [-2, -1],
                variable: 'defenseLost'
            },
            {
                action: 'condition',
                type: '=',
                value1: '{{c:defenseLost}}',
                value2: '0',
                goto:
                {
                    success: 5
                }
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
                value: [-3, -1],
                variable: 'hpLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} tried to hug {{opponent}} but got rejected and lost {{c:hpLost}} HP.'
            }
        ]
    },
    { // throw snowball
        value: 'throw[\\s\\S]*snowball',
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
                content: '{{user}} threw a snowball at {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} tried to throw a snowball towards {{opponent}} but missed.'
            }
        ],
        prodigy: 1
    },
    { // throw
        value: 'throw',
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
                content: '{{user}} threw stuff at {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} tried to throw stuff towards {{opponent}} but missed.'
            }
        ]
    },
    { // defend
        value: 'defend',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'def',
                value: [1, 4],
                variable: 'defenseGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} gained {{c:defenseGained}} DEF.'
            }
        ]
    },
    { // sugar rush
        value: 'sugar[\\s\\S]*rush',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [1, 3],
                variable: 'attackGained'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'acc',
                value: [-1, -1],
                variable: 'accuracyLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} went on a sugar rush and gained {{c:attackGained}} ATK but lost {{c:accuracyLost}} ACC.'
            }
        ]
    },
    { // yeet
        value: 'yeet',
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
                content: '{{user}} yeeted {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} failed to yeet {{opponent}}.'
            }
        ]
    },
    { // cake
        value: 'cake',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [1, 2],
                variable: 'hpGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} ate cake and gained {{c:hpGained}} HP.'
            }
        ]
    },
    { // caik
        value: 'caik',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [1, 3],
                variable: 'hpGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} ate caik and gained {{c:hpGained}} HP.'
            }
        ]
    },
    { // hot coco
        value: 'hot[\\s\\S]*coco',
        actions: [
            {
                action: 'randomChance',
                chance: 25,
                goto: {
                    fail: 4
                }
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [3, 8],
                variable: 'attackGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} drank hotcoco and gained {{c:attackGained}} ATK.'
            },
            {
                action: 'stop'
            },
            {
                action: 'damageOpponent',
                type: 'opponentAttack',
                variable: 'hpLost',
                goto: {
                    fail: 7
                }
            },
            {
                action: 'addMessage',
                content: '{{user}} was drinking hotcoco too slowly, so {{opponent}} was able to deal {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} drank hotcoco and nothing happened.'
            }
        ]
    },
    { // hot choc
        value: 'hot[\\s\\S]*choc',
        actions: [
            {
                action: 'randomChance',
                chance: 25,
                goto: {
                    fail: 4
                }
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [3, 8],
                variable: 'attackGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} drank hot chocolate and gained {{c:attackGained}} ATK.'
            },
            {
                action: 'stop'
            },
            {
                action: 'damageOpponent',
                type: 'opponentAttack',
                variable: 'hpLost',
                goto: {
                    fail: 7
                }
            },
            {
                action: 'addMessage',
                content: '{{user}} was drinking hot chocolate too slowly, so {{opponent}} was able to deal {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} drank hot chocolate and nothing happened.'
            }
        ]
    },
    { // ginger bread
        value: 'ginger[\\s\\S]*bread',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [2, 2],
                variable: 'hpGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} ate gingerbread and gained {{c:hpGained}} HP.'
            }
        ]
    },
    { // meow
        value: 'meow',
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
                content: '{{opponent}} was distracted by C A T S. {{user}} was able to deal {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} failed to distract {{opponent}} with c a t s.'
            }
        ]
    },
    { // snow man
        value: 'snow[\\s\\S]*man',
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
                who: 'user',
                type: 'def',
                value: [2, 7],
                variable: 'defenseGained'
            },
            {
                action: 'addMessage',
                content: 'A snowman blessed {{user}} with {{c:defenseGained}} DEF.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [-2, -2],
                variable: 'hpLost'
            },
            {
                action: 'addMessage',
                content: 'The snowball didn\'t like {{user}} and gave frostbite which dealed {{c:hpLost}} HP.'
            }
        ]
    },
    { // russian roulette
        value: 'russian roulette',
        actions: [
            {
                action: 'randomChance',
                chance: 66.66,
                goto: {
                    fail: 3
                }
            },
            {
                action: 'addMessage',
                content: '{{user}} played Russian Roulette and didn\'t die.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [-9999, -9999]
            },
            {
                action: 'addMessage',
                content: '{{user}} played Russian Roulette and died.'
            }
        ]
    },
    { // hi
        value: 'hi',
        actions: [
            {
                action: 'addMessage',
                content: '{{user}} waved "Hi".'
            }
        ],
        prodigy: -1
    },
    { // hey
        value: 'hey',
        actions: [
            {
                action: 'addMessage',
                content: '{{user}} waved "Hey".'
            }
        ],
        prodigy: -1
    },
    { // hello
        value: 'hello',
        actions: [
            {
                action: 'addMessage',
                content: '{{user}} waved "Hello".'
            }
        ],
        prodigy: -1
    },
    { // charge
        value: 'charge',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [1, 2],
                variable: 'attackGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} charged up {{c:attackGained}} ATK.'
            }
        ]
    },
    { // stat
        value: 'stat',
        actions: [
            {
                action: 'addMessage',
                content: '{{user}} wasted a turn to view stats.\n' +
                         '```\n' +
                         `Your ATK: {{userATK}}\n` +
                         `Your DEF: {{userDEF}}\n` +
                         `Your ACC: {{userACC}}\n\n` +
                         `Opponent's ATK: {{opponentATK}}\n` +
                         `Opponent's DEF: {{opponentDEF}}\n` +
                         `Opponent's ACC: {{opponentACC}}\n` +
                         '```'
            }
        ],
        prodigy: -2
    },
    {
        value: 'florida',
        actions: [
            {
                action: 'randomChance',
                chance: 1,
                goto: {
                    success: 3
                }
            },
            {
                action: 'addMessage',
                content: 'It\'s very peaceful here in Florida. Nothing is hidden here.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [20, 200],
                variable: 'hpGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} went to Florida and gained {{c:hpGained}} HP.'
            }
        ]
    },
    { // texas
        value: 'texas',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [3, 5],
                variable: 'attackGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} went up to Texas and obtained {{c:attackGained}} ATK.'
            }
        ]
    },
];
    
const parsedPrompts = [];

for (const { value, actions, prodigy = 0 } of unparsedPrompts) {
    parsedPrompts.push(
        {
            regex: new RegExp(`^[\\s\\S]*${value}[\\s\\S]*$`),
            actions,
            prodigy
        }
    );
}

await createPrompts(...parsedPrompts);

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