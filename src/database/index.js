'use strict';

import mongoose from 'mongoose';
import config from '../config';
import logger from '../logger';

const { CLUSTER_DOMAIN } = config.sources.database;

/**
 * Set event listener to mongoose.connection on error
 */
mongoose.connection.on('error', error => {
  logger.error(error);
});

/**
 * Set event listener to mongoose.connection on open
 */
mongoose.connection.on('open', () => {
  logger.info(`Connected to ${CLUSTER_DOMAIN}....`);
});

/**
 * Set event listener to mongoose.connection on disconnect
 */
mongoose.connection.on('disconnected', () => {
  logger.info(`Disconnected from ${CLUSTER_DOMAIN}....`);
});

/**
 * This warning message is indicating that the Mongoose library is currently using the "strictQuery" option and that this option will be switched back to "false" in Mongoose 7 by default.
 * Mongoose uses this option to determine whether to enforce strict query syntax. When set to "false", Mongoose will allow query conditions to match multiple properties.
 * To resolve this warning, you can either set "strictQuery" to "false" in your code by using the following line:
 */
mongoose.set('strictQuery', false);

/**
 * Mongoose singleton object to connect.
 */
const source = mongoose;

/**
 * Helper functions for the database
 */

export const getDatabaseConnectionString = () => {
  //Generate database string url with environment variables
  const {
    CLUSTER_DOMAIN,
    DB_NAME,
    DB_PASS: dbPass,
    DB_USER: dbUser,
    DB_APP_NAME: dbAppName
  } = config.sources.database;
  return `mongodb+srv://${dbUser}:${dbPass}@${CLUSTER_DOMAIN}/${DB_NAME}?retryWrites=true&w=majority&appName=${dbAppName}`;
};

export const closeDatabaseConnections = () => {
  //Close active connections to db
  return source.disconnect();
};

export const gracefulExit = () => {
  //Gracefully shuts down application by disconnecting from all active connections to db and then process.exit(0)
  logger.info('Shutting down application.');
  closeDatabaseConnections().then(() => {
    process.exit(0);
  });
};

export default source;
