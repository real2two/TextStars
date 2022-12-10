import Cluster from 'discord-hybrid-sharding';
import path from 'path';
import { fileURLToPath } from 'url';

export const manager = new Cluster.Manager(`${path.dirname(fileURLToPath(import.meta.url))}/bot.js`, {
    token: process.env.TOKEN
});

manager.extend(new Cluster.ReClusterManager());
manager.extend(
    new Cluster.HeartbeatManager({
        interval: 2000,
        maxMissedHeartbeats: 5
    })
);

manager.spawn({ timeout: -1 });