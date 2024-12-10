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

export const CUSTOM_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const PASSWORD_RESET_REQUEST_SUBJECT = 'Password Reset Request';

export const PASSWORD_RESET_SUCCESS_SUBJECT = 'Password Reset Successfully';

export const STRONG_PASSWORD_VALIDATIONS_REGEX =
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$';

export const PASSWORD_VALIDATION_MESSAGE =
  'Please enter a password at least 8 characters, at least one uppercase letter, one lowercase letter, and one special character.';

export const DEFAULT_VIDEO_FILE_EXTENTION = 'mp4';

export const DEFAULT_THUMBNAIL_FILE_EXTENTION = 'jpeg';

export const DEFAULT_SONG_FILE_EXTENTION = 'mp3';

export const DEFAULT_COVERIMAGE_FILE_EXTENTION = 'jpeg';
