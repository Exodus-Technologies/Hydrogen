'use strict';

import { configDotenv } from 'dotenv';
import { convertArgToBoolean } from '../utilities/boolean';

configDotenv();

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME,
  RATE_LIMIT_MS: +process.env.RATE_LIMIT_MS,
  RATE_LIMIT_MAX: +process.env.RATE_LIMIT_MAX,
  TRUST_PROXY: convertArgToBoolean(process.env.TRUST_PROXY),
  auth: {
    HASH_SALT: +process.env.HASH_SALT,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_EXPIRY: +process.env.TOKEN_EXPIRY
  },
  sources: {
    database: {
      CLUSTER_DOMAIN: process.env.CLUSTER_DOMAIN,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_PASS: process.env.DB_PASS,
      DB_APP_NAME: process.env.DB_APP_NAME,
      EXPIRY_TIME: +process.env.EXPIRY_TIME,
      options: {}
    }
  }
};

export default config;
