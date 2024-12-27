'use strict';

import rateLimit from 'express-rate-limit';
import config from '../config';
import logger from '../logger';
import { UserRepository } from '../repository';
import {
  HttpStatusCodes,
  forbiddenRequest,
  getStatusMessage,
  internalServerErrorRequest,
  unauthorizedRequest
} from '../response-codes';
import {
  isDevelopmentEnvironment,
  isProductionEnvironment
} from '../utilities/boolean';
import { verifyJWTToken } from '../utilities/token';
import { errorFormatter, validationResult } from '../validations';

const { RATE_LIMIT_MS, RATE_LIMIT_MAX } = config;

const requestResponseHandler = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.on('finish', () => {
    logger.info(
      `${res.statusCode} ${res.statusMessage}; ${res.get('X-Response-Time')} ${
        res.get('Content-Length') || 0
      }b sent`
    );
  });
  next();
};

const errorHandler = (err, req, res, next) => {
  err && logger.error(`Error: ${err.stack}`);
  return res.status(err.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    error: isProductionEnvironment()
      ? getStatusMessage(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      : err.message
  });
};

const rateLimitHandler = rateLimit({
  windowMs: RATE_LIMIT_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many calls made from this specific IP, please try again later'
});

const validationHandler = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
  next();
};

const validateAuthorizationTokenHandler = async (req, res, next) => {
  if (isDevelopmentEnvironment()) return next();
  const authorizationHeader = req.get('Authorization');

  if (!authorizationHeader) {
    const [statusCode, response] = unauthorizedRequest(
      'Access token is missing'
    );
    return res.status(statusCode).send(response);
  }

  //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MD......
  const tokenParts = authorizationHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    const [statusCode, response] = unauthorizedRequest(
      'Invalid authorization format'
    );
    return res.status(statusCode).send(response);
  }

  try {
    const token = tokenParts[1];

    const result = verifyJWTToken(token);

    if (!result) {
      const [statusCode, response] = forbiddenRequest(
        'Access token provided was not generated by this service.'
      );
      return res.status(statusCode).send(response);
    }

    const { email } = result.data;
    const [error, user] = await UserRepository.getUserByEmail(email);

    if (!user || error) {
      const [statusCode, response] = forbiddenRequest('Token metadata invalid');
      return res.status(statusCode).send(response);
    }

    //Setting user for req in the next function in the callstack
    req.user = result.data;
    next();
  } catch (err) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      const [statusCode, response] = forbiddenRequest('Token has expired.');
      return res.status(statusCode).send(response);
    }
    const [statusCode, response] = forbiddenRequest('Authenication Error.');
    return res.status(statusCode).send(response);
  }
};

const hasPermissionHandler = requiredPermissions => async (req, res, next) => {
  if (isDevelopmentEnvironment()) return next();
  try {
    const { email } = req.user;
    const [error, user] = await UserRepository.getUserByEmail(email);

    if (error) {
      const [statusCode, response] = forbiddenRequest(error.message);
      return res.status(statusCode).send(response);
    }

    const { permissions } = user;

    const isAllowed = requiredPermissions.every(perm =>
      permissions.includes(perm)
    );

    if (!isAllowed) {
      const [statusCode, response] = forbiddenRequest(
        'User not authorized to perform action.'
      );
      return res.status(statusCode).send(response);
    }

    //Removing user for req in the next function in the callstack
    delete req.user;
    next();
  } catch (err) {
    console.error(err);
    const [statusCode, response] = internalServerErrorRequest(
      isProductionEnvironment()
        ? getStatusMessage(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        : err.message
    );
    return res.status(statusCode).send(response);
  }
};

export {
  errorHandler,
  hasPermissionHandler,
  rateLimitHandler,
  requestResponseHandler,
  validateAuthorizationTokenHandler,
  validationHandler
};
