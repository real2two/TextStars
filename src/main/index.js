import 'dotenv/config';
import { exec } from 'child_process';
import { manager } from './clusters.js';

// Lazy console commands.
process.openStdin().addListener('data', d => {
    const data = d.toString().trim();

    if (!data.length) return;
    if (data === 'restart') return manager.recluster.start({ restartMode: 'rolling' });

    exec(data, (err, stdout, stderr) => {
        if (err || stderr) return process.stdout.write(stderr || err.message);
        process.stdout.write(stdout);
    });
});