import 'reflect-metadata'; // We need this in order to use @Decorators

import config from '../config';
import express from 'express';
import https from 'https';
import fs from 'fs';
import Logger from './loaders/logger';

async function startServer() {
    var options = {
        key: fs.readFileSync(config.key),
        cert: fs.readFileSync(config.cert),
    };

    const app = express();

    await require('./loaders').default({ expressApp: app });
    
    https.createServer(options, app).listen(config.port, () => {
        console.log("Server listening on port: " + config.port);
        Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
    })
        .on('error', (err) => {
            Logger.error(err);
            process.exit(1);
        });
}

startServer();
