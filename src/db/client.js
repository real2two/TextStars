import rn from 'random-number';
import { MongoClient } from 'mongodb';

export const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

export const db = client.db(process.env.MONGODB_DB);
export const prompts = db.collection('prompts');

export async function findPrompt(value = '', { duel, user, opponent }) {
    const findPrompts = await prompts.find({ $expr: { $regexMatch: { input: value, regex: '$regex' } } }).limit(100).toArray();
    const prompt = findPrompts.sort((a, b) => b.prodigy - a.prodigy)[0];
    if (!prompt) return null;

    const variables = {
        user: `<@!${user.id}>`,
        opponent: `<@!${opponent.id}>`
    };
    
    const userData = duel.data.find(u => u.id === user.id);
    const opponentData = duel.data.find(u => u.id === opponent.id);
    
    let current = 0;
    let fullContent = '';

    while (prompt.actions[current]) {
        const action = prompt.actions[current];
        let didGoto = false;

        variables['userHP'] = userData.hp;
        variables['userATK'] = userData.atk;
        variables['userDEF'] = userData.def;
        variables['userACC'] = userData.acc;

        variables['opponentHP'] = opponentData.hp;
        variables['opponentATK'] = opponentData.atk;
        variables['opponentDEF'] = opponentData.def;
        variables['opponentACC'] = opponentData.acc;

        switch (action.action) {
            case 'addMessage':
                let content = action.content;
                for (const match of content.matchAll(/{{.*?}}/g)) {
                    content = content.replace(match[0], (match[0].substring(2, match[0].length - 2) in variables ? variables[match[0].substring(2, match[0].length - 2)] : match[0]));
                }
                fullContent += content;
                break;
            case 'condition': {
                let value1 = action.value1;
                for (const match of value1.matchAll(/{{.*?}}/g)) {
                    value1 = value1.replace(match[0], (match[0].substring(2, match[0].length - 2) in variables ? variables[match[0].substring(2, match[0].length - 2)] : match[0]));
                }

                let value2 = action.value2;
                for (const match of value2.matchAll(/{{.*?}}/g)) {
                    value2 = value2.replace(match[0], (match[0].substring(2, match[0].length - 2) in variables ? variables[match[0].substring(2, match[0].length - 2)] : match[0]));
                }

                let pass = false;
                switch (action.type) {
                    case '=':
                        if (value1 == value2) pass = true;
                        break;
                    case '<':
                        if (value1 < value2) pass = true;
                        break;
                    case '>':
                        if (value1 > value2) pass = true;
                        break;
                    case '<=':
                        if (value1 <= value2) pass = true;
                        break;
                    case '>=':
                        if (value1 >= value2) pass = true;
                        break;
                }
                if (pass) {
                    if (action.goto && action.goto.success) {
                        didGoto = true;
                        current = action.goto.success;
                    }
                } else {
                    if (action.goto && action.goto.fail) {
                        didGoto = true;
                        current = action.goto.fail;
                    }
                }
                break;
            }
            case 'damageOpponent':
                if (['userAttack', 'opponentAttack'].includes(action.type)) {
                    const p1 = action.type === 'userAttack' ? userData : opponentData;
                    const p2 = action.type === 'userAttack' ? opponentData : userData;
                    if (Math.random() < p1.acc / 100) {
                        const r_atk = p1.atk + Math.floor(Math.random() * 5) - 2;
                        const dam = Math.round(r_atk * r_atk / (r_atk + p2.def));
                        p2.hp -= dam;
                        if (action.variable) variables[`c:${action.variable}`] = dam;
                        if (action.goto && action.goto.success) {
                            didGoto = true;
                            current = action.goto.success;
                        }
                    } else {
                        if (action.goto && action.goto.fail) {
                            didGoto = true;
                            current = action.goto.fail;
                        }
                    }
                }
                break;
            case 'randomChance':
                if (Math.random() < action.chance / 100) {
                    if (action.goto.success) {
                        didGoto = true;
                        current = action.goto.success;
                    }
                } else {
                    if (action.goto.fail) {
                        didGoto = true;
                        current = action.goto.fail;
                    }
                }
                break;
            case 'modifyStats': {
                if (['user', 'opponent'].includes(action.who)) {
                    const player = action.who === 'user' ? userData : opponentData;
                    const addedValue = rn({ min: action.value[0], max: action.value[1], integer: true });
                    if (player[action.type] + addedValue > 9999) {
                        if (action.variable) variables[`c:${action.variable}`] = 9999 - player[action.type];
                        player[action.type] = 9999;
                    } else if (player[action.type] + addedValue < 0) {
                        if (action.variable) variables[`c:${action.variable}`] = -player[action.type] || 0;
                        player[action.type] = 0;
                    } else {
                        if (action.variable) variables[`c:${action.variable}`] = addedValue;
                        player[action.type] += addedValue;
                    }
                }
                break;
            }
            case 'stop':
                current = prompt.actions.length;
                break;
        }

        if (!didGoto) current++;
    }

    if (userData.hp < 0) userData.hp = 0;
    if (opponentData.hp < 0) opponentData.hp = 0;

    return { content: fullContent };
}

export function createPrompt({ regex, actions = [], prodigy = 0 }) {
    return prompts.insertOne({
       regex, // /^[\s\S]*YOUR_VALUE[\s\S]*$/
       actions,
       prodigy
    });
}

export async function createPrompts(...prompts) {
    const output = [];
    for (const prompt of prompts) output.push(await createPrompt(prompt));
    return output;
}