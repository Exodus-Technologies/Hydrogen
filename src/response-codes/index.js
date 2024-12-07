'use strict';

export const HttpStatusCodes = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
});

export const getStatusMessage = statusCode => {
  switch (statusCode) {
    case HttpStatusCodes.OK:
      return 'Success';
    case HttpStatusCodes.CREATED:
      return 'Created';
    case HttpStatusCodes.ACCEPTED:
      return 'Accepted';
    case HttpStatusCodes.NO_CONTENT:
      return 'No Content';
    case HttpStatusCodes.BAD_REQUEST:
      return 'Bad Request';
    case HttpStatusCodes.FORBIDDEN:
      return 'Forbidden';
    case HttpStatusCodes.UNAUTHORIZED:
      return 'Unauthorized';
    case HttpStatusCodes.NOT_FOUND:
      return 'Not Found';
    case HttpStatusCodes.METHOD_NOT_ALLOWED:
      return 'Method Not Allowed';
    case HttpStatusCodes.BAD_GATEWAY:
      return 'Bad Gateway';
    case HttpStatusCodes.SERVICE_UNAVAILABLE:
      return 'Service Unavailable';
    case HttpStatusCodes.INTERNAL_SERVER_ERROR:
      return 'Internal Server Error';
    default:
      return 'Unknown status code';
  }
};

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
