'use strict';

import config from './config';
import source, {
  closeDatabaseConnections,
  getDatabaseConnectionString,
  gracefulExit,
  seedPermissions,
  seedRoles
} from './database';
import logger from './logger';
import server from './server';
import { normalizePort } from './utilities/system';
import { getCurrentUTCTimestampFormatted } from './utilities/time';

/**
 * Connects to database
 */
const initializeDBConnection = () => {
  const { options } = config.sources.database;
  try {
    source.connect(getDatabaseConnectionString(), options);
  } catch (e) {
    logger.error(`Error connecting to db: ${e}`);
    throw e;
  }
};

/**
 * Seeds data to database
 */
const initializeSeedOperation = async () => {
  try {
    await seedPermissions();
    await seedRoles();
  } catch (e) {
    logger.error(`Error seeding data to db: ${e.message}`);
    throw e;
  }
};

/**
 * Starts web server
 */
const startServer = () => {
  const { PORT, HOST } = config;
  try {
    server.listen(normalizePort(PORT), HOST);
    logger.info(`Server listening on port: ${PORT}`);
  } catch (err) {
    logger.error(`Server started with error: ${err}`);
    throw err;
  }
};

/**
 * Start web application
 */
const runApplication = async () => {
  const { APP_NAME } = config;
  logger.info(`Starting ${APP_NAME} app...`);
  initializeDBConnection();
  // await initializeSeedOperation();
  startServer();
};

runApplication().catch(err => {
  logger.error(`Error starting application: ${err.message}`);
});

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
    logger.error(`Unhandled rejection, reason: ${reason.stack} `);
  })
  .on('uncaughtException', err => {
    console.error(
      getCurrentUTCTimestampFormatted() + ' uncaughtException:',
      err.message
    );
    logger.error(`Uncaught exception thrown: ${err.message}`);
    logger.info(
      'Disconnecting from database and shutting down application from uncaughtException.'
    );
    closeDatabaseConnections().then(() => {
      process.exit(1);
    });
  })
  .on('SIGINT', gracefulExit)
  .on('SIGTERM', gracefulExit);
