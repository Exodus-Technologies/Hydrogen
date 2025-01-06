'use strict';

import logger from '../logger';
import { LoginService } from '../services';

exports.getLogins = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const [statusCode, response] = await LoginService.getLogins(userId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with get user logins: ${err.message}`);
    next(err);
  }
};
