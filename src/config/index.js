'use strict';

import { configDotenv } from 'dotenv';
import { convertArgToBoolean } from '../utilities/boolean';

configDotenv();

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME,
  TRUST_PROXY: convertArgToBoolean(process.env.TRUST_PROXY),
  HASH_SALT: +process.env.HASH_SALT,
  JWT_SECRET: process.env.JWT_SECRET,
  sources: {
    database: {
      CLUSTER_DOMAIN: process.env.CLUSTER_DOMAIN,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_PASS: process.env.DB_PASS,
      options: {}
    }
  }
};

export default config;
