'use strict';

import { getStatusMessage, HttpStatusCodes } from '../constants';

export const badRequest = message => {
  return [
    HttpStatusCodes.BAD_REQUEST,
    {
      errors: [
        {
          value: getStatusMessage(HttpStatusCodes.BAD_REQUEST),
          msg: message
        }
      ]
    }
  ];
};

export const unauthorizedRequest = message => {
  return [
    HttpStatusCodes.UNAUTHORIZED,
    {
      errors: [
        {
          value: getStatusMessage(HttpStatusCodes.UNAUTHORIZED),
          msg: message
        }
      ]
    }
  ];
};

export const forbiddenRequest = message => {
  return [
    HttpStatusCodes.FORBIDDEN,
    {
      errors: [
        {
          value: getStatusMessage(HttpStatusCodes.FORBIDDEN),
          msg: message
        }
      ]
    }
  ];
};

export const notFoundRequest = message => {
  return [
    HttpStatusCodes.NOT_FOUND,
    {
      errors: [
        {
          value: getStatusMessage(HttpStatusCodes.NOT_FOUND),
          msg: message
        }
      ]
    }
  ];
};

export const internalServerErrorRequest = message => {
  return [
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    {
      errors: [
        {
          value: getStatusMessage(HttpStatusCodes.INTERNAL_SERVER_ERROR),
          msg: message
        }
      ]
    }
  ];
};
