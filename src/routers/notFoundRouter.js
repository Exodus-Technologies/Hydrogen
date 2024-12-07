'use strict';

import express from 'express';
import { HttpStatusCodes, getStatusMessage } from '../response-codes';

const { Router } = express;

const router = Router();

router.get('*', (_, res) => {
  return res
    .status(HttpStatusCodes.NOT_FOUND)
    .send({ message: getStatusMessage(HttpStatusCodes.NOT_FOUND) });
});

export default router;
