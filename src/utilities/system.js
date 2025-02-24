'use strict';

import { closeDatabaseConnections } from '../database';
import logger from '../logger';

export const getClientIpAddress = req => {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded
    ? forwarded.split(',')[0]
    : req.socket.remoteAddress || req.ip;
};

export const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

export const gracefulExit = () => {
  //Gracefully shuts down application by disconnecting from all active connections to db and then process.exit(0)
  logger.info('Shutting down application.');
  closeDatabaseConnections().then(() => {
    process.exit(0);
  });
};
