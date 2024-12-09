'use strict';

import express from 'express';
import config from '../config';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler
} from '../middlewares';
import { HttpStatusCodes } from '../response-codes';
import { capitalizeFirstLetter } from '../utilities/strings';
import { fancyTimeFormat } from '../utilities/time';

const { Router } = express;
const { version } = require('../../package.json');

const appName = `${capitalizeFirstLetter(config.APP_NAME)}`;

const router = Router();

router.get('/', (_, res) => {
  res.status(HttpStatusCodes.OK).send({
    message: `Welcome to ${appName} Service Manager Service!`
  });
});

router.get('/probeCheck', (_, res) => {
  res.status(HttpStatusCodes.OK).send({
    uptime: fancyTimeFormat(process.uptime()),
    date: new Date(),
    message: `${appName} Service Manager service up and running!`,
    version
  });
});

router.get(
  '/getIp',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  (req, res) => res.send(req.ip)
);

router.get(
  '/getConfiguration',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  (_, res) => {
    res.status(HttpStatusCodes.OK).json(config);
  }
);

export default router;
