'use strict';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import noCache from 'nocache';
import responseTime from 'response-time';

import config from './config';
import { BASE_URL } from './constants';
import logger from './logger';
import {
  errorHandler,
  rateLimitHandler,
  requestResponseHandler
} from './middlewares';
import {
  authRouter,
  mainRouter,
  notFoundRouter,
  permissionRouter,
  roleRouter,
  tagRouter,
  userRouter,
  videoRouter
} from './routers';
import { isProductionEnvironment } from './utilities/boolean';

// Create the Express application object
const server = express();

//BodyParser middleware
server.use(express.urlencoded({ limit: '50Mb', extended: false }));
server.use(express.json({ limit: '50Mb' }));
logger.info('Loaded body-parser middleware.');

// Response time middleware
server.use(responseTime());
logger.info('Loaded response time middleware.');

//error handler middleware
server.use(errorHandler);
logger.info('Loaded error handler middleware.');

//route middleware with request/response
server.use(requestResponseHandler);
logger.info('Loaded request/response middleware.');

if (isProductionEnvironment()) {
  const { TRUST_PROXY } = config;

  // specify a single subnet
  server.set('trust proxy', TRUST_PROXY);
  logger.info('Proxy setting enabled.');

  //Cors middleware
  server.use(cors());
  logger.info('CORS enabled.');

  //Helmet middleware
  server.use(helmet());
  server.use(
    helmet({
      xPoweredBy: false
    })
  );

  server.disable('x-powered-by');
  logger.info('Loaded helmet middleware.');

  //No cache middleware
  server.use(noCache());
  logger.info('Loaded no-cache middleware.');

  //Compression middleware
  server.use(compression());
  logger.info('Loaded compression middleware.');

  server.use(rateLimitHandler);
  logger.info('Loaded rate limit middleware.');
}

server.use(BASE_URL, mainRouter);
logger.info('Loaded main routes middleware.');

server.use(BASE_URL, roleRouter);
logger.info('Loaded role routes middleware.');

server.use(BASE_URL, permissionRouter);
logger.info('Loaded permission routes middleware.');

server.use(BASE_URL, authRouter);
logger.info('Loaded auth routes middleware.');

server.use(BASE_URL, userRouter);
logger.info('Loaded user routes middleware.');

server.use(BASE_URL, tagRouter);
logger.info('Loaded tag routes middleware.');

server.use(BASE_URL, videoRouter);
logger.info('Loaded video routes middleware.');

server.use(notFoundRouter);
logger.info('Loaded not found routes middleware.');

export default http.createServer(server);
