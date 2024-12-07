'use strict';

import jwt from 'jsonwebtoken';
import moment from 'moment';
import { customAlphabet } from 'nanoid';
import config from '../config';
import { CUSTOM_ALPHABET } from '../constants';

const { sign, verify } = jwt;
const { auth } = config;
const { JWT_SECRET, TOKEN_EXPIRY } = auth;

export const generateAuthorizationToken = user => {
  const { email, fullName, role } = user;
  const expirationTime = moment().add(TOKEN_EXPIRY, 'minutes').valueOf() / 1000;
  try {
    return sign(
      {
        exp: Math.ceil(expirationTime),
        data: { email, fullName, role }
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

export const generateOTPCode = () => {
  return customAlphabet(CUSTOM_ALPHABET, 6)();
};
