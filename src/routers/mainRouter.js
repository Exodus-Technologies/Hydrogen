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

const { APP_NAME } = config;

const router = Router();

router.get('/', (_, res) => {
  res.status(HttpStatusCodes.OK).send({
    message: `Welcome to ${capitalizeFirstLetter(
      APP_NAME
    )} Service Manager Service!`
  });
});

router.get('/probeCheck', (_, res) => {
  res.status(HttpStatusCodes.OK).send({
    uptime: fancyTimeFormat(process.uptime()),
    date: new Date(),
    message: `${capitalizeFirstLetter(
      APP_NAME
    )} Service Manager service up and running!`,
    appVersion: version
  });
});

router.get(
  '/getIp',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_CONFIGURE']),
  (req, res) => res.send(req.ip)
);

router.get(
  '/getConfiguration',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_CONFIGURE']),
  (_, res) => {
    res.status(HttpStatusCodes.OK).send(config);
  }
);

export default router;
