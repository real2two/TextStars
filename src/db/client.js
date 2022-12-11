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

        switch (action.action) {
            case 'addMessage':
                let content = action.content;
                for (const match of content.matchAll(/{{.*?}}/g)) {
                    content = content.replace(match[0], (variables[match[0].substring(2, match[0].length - 2)] || match[0]));
                }
                fullContent += content;
                break;
            case 'damageOpponent':
                // const r_atk = att + Math.floor(Math.random() * 5) - 2;
                // const damage = r_atk * r_atk / (r_atk + def);

                if (action.type === 'userAttack') {
                    if (Math.random() < userData.acc / 100) {
                        const r_atk = userData.atk + Math.floor(Math.random() * 5) - 2;
                        const dam = Math.round(r_atk * r_atk / (r_atk + opponentData.def));
                        opponentData.hp -= dam;
                        if (action.variable) variables[`c:${action.variable}`] = dam;
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
                }
                break;
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