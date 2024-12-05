'use strict';

import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config';
import { TOKEN_EXPIRY } from '../constants';

const { sign, verify } = jwt;
const { JWT_SECRET } = config;

export const generateAuthorizationToken = user => {
  const { isAdmin, email, userId } = user;
  const expirationTime = moment().add(TOKEN_EXPIRY, 'minutes').valueOf() / 1000;
  const payload = { isAdmin, email, userId };
  try {
    return sign(
      {
        exp: Math.ceil(expirationTime),
        data: payload
      },
      JWT_SECRET
    );
  } catch {
    console.error(err);
    return undefined;
  }
};

export const verifyJWTToken = token => {
  try {
    const decoded = verify(token, JWT_SECRET);
    if (decoded) {
      return decoded;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
