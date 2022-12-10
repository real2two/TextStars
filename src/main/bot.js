import Cluster from 'discord-hybrid-sharding';
import Eris, { Constants } from 'eris';

export const client = new Eris(process.env.TOKEN, {
    firstShardID: Cluster.data.LAST_SHARD_ID,
    lastShardID: Cluster.data.FIRST_SHARD_ID,
    maxShards: Cluster.data.TOTAL_SHARDS,

    intents: [ Constants.Intents.guilds, Constants.Intents.guildMembers ]
});

client.cluster = new Cluster.Client(client);
client.cluster.triggerReady();

console.log(`[CLUSTER #${client.cluster.id}] Launched cluster.`);

import('../events/interactionCreate.js');

client.on('error', err => {
    console.error(err);
});

client.connect();