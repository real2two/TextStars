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
                type: '<=',
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
    { // florida
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
    { // tree
        value: 'tree',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'acc',
                value: [1, 2],
                variable: 'accuracyGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} inhaled a Christmas tree gaining {{c:accuracyGained}} ACC.'
            }
        ]
    },
    { // christmas
        value: 'christmas',
        actions: [
            {
                action: 'addMessage',
                content: 'Christmas? Try `throw snowball`, `sugar rush`, `gingerbread`, `snowman`, `tree`, `christmas`, `gift`, `santa`, `sugar cane`, etc...'
            }
        ],
        prodigy: -3
    },
    { // gift
        value: 'gift',
        actions: [
            {
                action: 'randomChance',
                chance: 40,
                goto: {
                    fail: 4
                }
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [1, 5],
                variable: 'attackGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} opened a present and gained {{c:attackGained}} ATK.'
            },
            {
                action: 'stop'
            },
            {
                action: 'randomChance',
                chance: 45,
                goto: {
                    fail: 8
                }
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'def',
                value: [1, 5],
                variable: 'defenseGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} opened a present and gained {{c:defenseGained}} DEF.'
            },
            {
                action: 'stop'
            },
            {
                action: 'randomChance',
                chance: 50,
                goto: {
                    fail: 12
                }
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'acc',
                value: [1, 5],
                variable: 'accuracyGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} opened a present and gained {{c:accuracyGained}} ACC.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'acc',
                value: [1, 5],
                variable: 'hpGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} opened a present and gained {{c:hpGained}} HP.'
            }
        ]
    },
    { // santa
        value: 'santa',
        actions: [
            {
                action: 'randomChance',
                chance: 50,
                goto: { success: 5 }
            },
            {
                action: 'randomChance',
                chance: 50,
                goto: { success: 7 }
            },
            {
                action: 'randomChance',
                chance: 50,
                goto: { fail: 9 }
            },
            {
                action: 'addMessage',
                content: 'Santa left you a gift! It looks black...'
            },
            { action: 'stop' },
            {
                action: 'addMessage',
                content: 'Santa knows everything you\'re doing.'
            },
            { action: 'stop' },
            {
                action: 'addMessage',
                content: 'Santa will appear at under your bed tonight.'
            },
            { action: 'stop' },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [1, 10],
                variable: 'hpGained'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [1, 10],
                variable: 'attackGained'
            },
            {
                action: 'addMessage',
                content: 'Santa brought you an amazing present! You gained {{c:hpGained}} HP and {{c:attackGained}} ATK.'
            },
        ]
    },
    { // shut up santa
        value: 'shut up santa',
        exact: true,
        actions: [
            {
                action: "addMessage",
                content: "No."
            }
        ],
        prodigy: 1
    },
    { // sugar cane
        value: 'sugar[\\s\\S]*cane',
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
                content: '{{user}} ate a sugarcane and gained {{c:attackGained}} ATK.'
            }
        ]
    },
    { // retreat
        value: 'retreat',
        actions: [
            {
                action: 'randomChance',
                chance: 1,
                goto: {
                    success: 4
                }
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [-9999, -9999]
            },
            {
                action: 'addMessage',
                content: '{{user}} retreated.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [ 100, 200 ],
                variable: 'attackGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} felt like retreating but felt a strong pulse of motivation.\n{{user}} gained {{c:attackGained}} ATK.'
            }
        ],
        prodigy: -3
    },
    { // heal
        value: 'heal',
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
                content: '{{user}} healed {{c:hpGained}} HP.'
            }
        ]
    },
    { // hug
        value: 'hug',
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
                type: 'hp',
                value: [-1, -1],
                variable: 'hpLost'
            },
            {
                action: 'addMessage',
                content: 'EMOTIONAL DAMAGE. {{user}} tried to hug {{opponent}} but was regretted. ({{c:hpLost}} HP)'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'def',
                value: [-5, -2],
                variable: 'defenseLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} hugged {{opponent}}.\n{{opponent}} lost {{c:defenseLost}} DEF.'
            }
        ]
    },
    { // self destruct
        value: 'self destruct',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [-9999, -9999]
            },
            {
                action: 'addMessage',
                content: '{{user}} self destructed.'
            },
        ]
    },
    { // ohio
        value: 'ohio',
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
                content: `Ohio is an American state in the Midwest region of the country that became the subject of memes across social media platforms like Twitter, Tumblr, Reddit, Instagram and TikTok, among other platforms, predominantly following the Ohio vs. the World trend that started in 2016. Going into the 2020s, the concept of Ohio as a meme became commonplace through multiple trends that humorously labeled Ohio as an American middle place, existing as a capitalist wasteland of chaos and mayhem, akin to creepypastas, lore and randomness, becoming an imagined epitome of American signifiers such as Breezewood, Pennsylvania. Ohio meme trends include Wait, It's All Ohio? Always Has Been, Can't Even X in Ohio, Only in Ohio, the Ohio Final Boss and the King of Ohio, among other micro-trends.\n\n` +
                         '{{opponent}} lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: `Ohio is an American state in the Midwest region of the country that became the subject of memes across social media platforms like Twitter, Tumblr, Reddit, Instagram and TikTok, among other platforms, predominantly following the Ohio vs. the World trend that started in 2016. Going into the 2020s, the concept of Ohio as a meme became commonplace through multiple trends that humorously labeled Ohio as an American middle place, existing as a capitalist wasteland of chaos and mayhem, akin to creepypastas, lore and randomness, becoming an imagined epitome of American signifiers such as Breezewood, Pennsylvania. Ohio meme trends include Wait, It's All Ohio? Always Has Been, Can't Even X in Ohio, Only in Ohio, the Ohio Final Boss and the King of Ohio, among other micro-trends.\n\n` +
                         '{{opponent}} lost 0 HP.'
            }
        ]
    },
    { // punch
        value: 'punch',
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
                content: '{{user}} punched {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} attempted to punched {{opponent}} but missed.'
            }
        ]
    },
    { // kick
        value: 'kick',
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
                content: '{{user}} kicked {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} attempted to kick {{opponent}} but missed.'
            }
        ]
    },
    { // stab
        value: 'stab',
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
                content: '{{user}} stabbed {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} attempted to stab {{opponent}} but missed.'
            }
        ]
    },
    { // murder
        value: 'murder',
        actions: [
            {
                action: 'damageOpponent',
                type: 'userAttack',
                variable: 'hpLost',
                goto:
                {
                    fail: 6
                }
            },
            {
                action: 'condition',
                type: '<=',
                value1: '{{opponentHP}}',
                value2: '0',
                goto: {
                    fail: 4
                }
            },
            {
                action: 'addMessage',
                content: '{{user}} successfully murdered {{opponent}}.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} failed to murder {{opponent}} but managed to stab {{opponent}}.\n{{opponent}} lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} failed to murder {{opponent}}.'
            }
        ]
    },
    { // kill
        value: 'kill',
        actions: [
            {
                action: 'damageOpponent',
                type: 'userAttack',
                variable: 'hpLost',
                goto:
                {
                    fail: 6
                }
            },
            {
                action: 'condition',
                type: '<=',
                value1: '{{opponentHP}}',
                value2: '0',
                goto: {
                    fail: 4
                }
            },
            {
                action: 'addMessage',
                content: '{{user}} successfully killed {{opponent}}.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} failed to kill {{opponent}} but managed to stab {{opponent}}.\n{{opponent}} lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} failed to kill {{opponent}}.'
            }
        ]
    },
    { // bully
        value: 'bully',
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
                content: '{{user}} bullied {{opponent}} and lost {{c:hpLost}} HP in EMOTIONAL DAMAGE.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} bullied {{opponent}} but {{opponent}} did not give a quack.'
            }
        ]
    },
    { // lick
        value: 'lick',
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
                content: '{{user}} pulled a devious lick on {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} failed to lick {{opponent}}.'
            }
        ]
    },
    { // beat
        value: 'beat',
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
                content: '{{user}} beat up {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} attempted to beat up {{opponent}} but failed.'
            }
        ]
    },
    { // quack
        value: 'quack',
        actions: [
            {
                action: 'addMessage',
                content: '{{user}} quacked.'
            }
        ]
    },
    { // milk
        value: 'milk',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [0, 10],
                variable: 'hpGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} drank milk and gained {{c:hpGained}} HP.'
            }
        ]
    },
    { // milm
        value: 'milm',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [2, 10],
                variable: 'hpGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} drank the milm and gained {{c:hpGained}} HP.'
            }
        ]
    },
    { // fly
        value: 'fly',
        actions: [
            {
                action: 'addMessage',
                content: '{{user}} tried to fly only to realize humans don\'t have wings.'
            }
        ]
    },
    { // drink
        value: 'drink',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [0, 10],
                variable: 'accuracyGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} drank something and gained {{c:accuracyGained}} ACC.'
            }
        ]
    },
    { // niko kneecap
        value: 'niko kneecap',
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
                type: 'hp',
                value: [-5, -5],
                variable: 'hpLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} broke kneecaps and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'hp',
                value: [-5, -5],
                variable: 'hpLost'
            },
            {
                action: 'addMessage',
                content: '{{opponent}} broke kneecaps and lost {{c:hpLost}} HP.'
            },
        ]
    },
    { // gr
        value: 'gr',
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
                content: '{{user}} growled which damaged {{opponent}} by {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} growled like a idiot.'
            }
        ]
    },
    { // hit
        value: 'hit',
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
                content: '{{user}} hit {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} attempted to hit {{opponent}} but missed.'
            }
        ]
    },
    { // piss
        value: 'piss',
        actions: [
            {
                action: 'condition',
                type: '=',
                value1: '{{user}}',
                value2: '<@!1043890984947290134>',
                goto: {
                    success: 1,
                    fail: 2
                }
            },
            {
                action: 'randomChance',
                chance: 50,
                goto: {
                    success: 3,
                    fail: 6
                }
            },
            {
                action: 'randomChance',
                chance: 1,
                goto: {
                    success: 6,
                    fail: 3
                }
            },
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'def',
                value: [-5, -1],
                variable: 'defenseLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} pissed on {{opponent}}.\n{{opponent}}\'s DEF fell by {{c:defenseLost}}.'
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
                action: 'modifyStats',
                who: 'opponent',
                type: 'hp',
                value: [-9999, -9999]
            },
            {
                action: 'addMessage',
                content: '{{opponent}} was concerned and brought {{user}} to a mental hospital.'
            }
        ]
    },
    { // flash bang
        value: 'flash[\\s\\S]*bang',
        actions: [
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'hp',
                value: [-1, -1],
                variable: 'hpLost'
            },
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'acc',
                value: [-1, -1],
                variable: 'accuracyLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} flashbanged {{opponent}} and lost {{c:hpLost}} HP and {{c:accuracyLost}} ACC.'
            }
        ]
    },
    { // swim
        value: 'swim',
        actions: [
            {
                action: 'modifyStats',
                who: 'user',
                type: 'acc',
                value: [1, 8],
                variable: 'accuracyGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} decided to go swim and gained {{c:accuracyGained}} ACC.'
            }
        ]
    },
    { // shoot
        value: 'shoot',
        actions: [
            {
                action: 'addMessage',
                content: '{{user}} tried to shoot a gun but realize this isn\'t America.'
            }
        ]
    },
    { // shuriken
        value: 'shuriken',
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
                content: '{{user}} threw a shuriken and {{opponent}} got hit losing {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} threw a shuriken but missed.'
            }
        ]
    },
    { // rick roll
        value: 'rick[\\s\\S]*roll',
        actions: [
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'atk',
                value: [-1, -3],
                variable: 'attackLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} [rickrolled](https://discord.gg/ggZn8PaQed) and {{opponent}} lost {{c:attackLost}} ATK.'
            }
        ]
    },
    { // assault
        value: 'assault',
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
                content: '{{user}} assaulted {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} attempted to assault {{opponent}} but failed.'
            }
        ]
    },
    { // gamble
        value: 'gamble',
        actions: [
            {
                action: 'randomChance',
                chance: 50,
                goto: {
                    fail: 7
                }
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [1, 5],
                variable: 'hpGained'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [1, 2],
                variable: 'attackGained'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'def',
                value: [1, 3],
                variable: 'defenseGained'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'acc',
                value: [1, 5],
                variable: 'accuracyGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} gambled and won {{c:hpGained}} HP, {{c:attackGained}} ATK, {{c:defenseGained}} DEF, and {{c:accuracyGained}} ACC.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [-6, -2],
                variable: 'hpLost'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'atk',
                value: [-3, -2],
                variable: 'attackLost'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'def',
                value: [-4, -2],
                variable: 'defenseLost'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'acc',
                value: [-6, -2],
                variable: 'accuracyLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} gambled and lost {{c:hpLost}} HP, {{c:attackLost}} ATK, {{c:defenseLost}} DEF, and {{c:accuracyLost}} ACC.'
            },
        ]
    },
    { // light saber
        value: 'light( )?saber',
        actions: [
            {
                action: 'randomChance',
                chance: 5,
                goto: {
                    success: 3
                }
            },
            {
                action: 'addMessage',
                content: 'The force did not be with {{user}}.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'hp',
                value: [-50, -1],
                variable: 'hpLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} used the force to grab a ||toy|| lightsaber then whacked {{opponent}}.\n{{opponent}} lost {{c:hpLost}} HP.'
            }
        ]
    },
    { // slap
        value: 'slap',
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
                content: '{{user}} slapped {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} attempted to slap {{opponent}} but missed.'
            }
        ]
    },
    { // explosion | explode
        value: '(explosion|explode)',
        actions: [
            {
                action: 'addMessage',
                content: '🧨 INCOMING DYNAMITE!!!\n'
            },
            // Defines variables.
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [0, 0],
                variable: 'userHpLost'
            },
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'hp',
                value: [0, 0],
                variable: 'opponentHpLost'
            },
            // Random (user).
            {
                action: 'randomChance',
                chance: 50,
                goto: {
                    success: 5
                }
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [-10, -5],
                variable: 'userHpLost'
            },
            // Random. (opponent)
            {
                action: 'randomChance',
                chance: 50,
                goto: {
                    success: 7
                }
            },
            {
                action: 'modifyStats',
                who: 'opponent',
                type: 'hp',
                value: [-10, -5],
                variable: 'opponentHpLost'
            },
            {
                action: 'addMessage',
                content: '{{user}} lost {{c:userHpLost}} HP, and {{opponent}} lost {{c:opponentHpLost}} HP.'
            },
        ]
    },
    { // pray
        value: 'pray',
        actions: [
            {
                action: 'randomChance',
                chance: 50,
                goto: {
                    success: 3
                }
            },
            {
                action: 'addMessage',
                content: '{{user}} prayed... it seems like nothing happened?'
            },
            {
                action: 'stop'
            },
            {
                action: 'randomChance',
                chance: 20,
                goto: {
                    success: 6
                }
            },
            {
                action: 'addMessage',
                content: '{{user}} prayed... and heard whispers from the sky.'
            },
            {
                action: 'stop'
            },
            {
                action: 'modifyStats',
                who: 'user',
                type: 'hp',
                value: [1, 50],
                variable: 'hpGained'
            },
            {
                action: 'addMessage',
                content: '{{user}} was blessed by luck and gained {{c:hpGained}} HP.'
            }
        ]
    },
    { // shock
        value: 'shock',
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
                content: '{{user}} shocked {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} attempted to shock {{opponent}} but failed.'
            }
        ]
    },
    { // electrify | electrified
        value: 'electrif(y|ied)',
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
                content: '{{user}} electrified {{opponent}} and lost {{c:hpLost}} HP.'
            },
            {
                action: 'stop'
            },
            {
                action: 'addMessage',
                content: '{{user}} attempted to electrify {{opponent}} but failed.'
            }
        ]
    }
];
    
const parsedPrompts = [];

for (const { value, actions, prodigy = 0, exact = false } of unparsedPrompts) {
    parsedPrompts.push(
        {
            regex: exact ? new RegExp(`^${value}$`) : new RegExp(`^[\\s\\S]*${value}[\\s\\S]*$`),
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