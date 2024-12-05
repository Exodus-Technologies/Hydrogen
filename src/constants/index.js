'use strict';

import config from '../config';

const { APP_NAME } = config;

export const BASE_URL = `/${APP_NAME}-service`;

export const STATES = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FM',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MH',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PW',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY'
];

export const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const TOKEN_EXPIRY = 60;

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
