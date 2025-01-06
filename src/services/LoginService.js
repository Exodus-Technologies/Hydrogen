'use strict';

import logger from '../logger';
import { LoginRepository } from '../repository';
import {
  HttpStatusCodes,
  badRequest,
  internalServerErrorRequest
} from '../response-codes';

exports.getLogins = async userId => {
  try {
    const [error, logins] = await LoginRepository.getLogins(userId);
    if (logins) {
      return [
        HttpStatusCodes.OK,
        { message: 'Logins fetched from db with success', logins }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error(err);
    logger.error(`Error getting all logins: ${err.message}`);
    return internalServerErrorRequest('Error getting logins.');
  }
};
