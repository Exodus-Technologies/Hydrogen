'use strict';

import mongoose from 'mongoose';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;

//LOGIN SCHEMA
//  ============================================
const loginSchema = new Schema({
  userId: {
    type: Number,
    required: true,
    index: true
  },
  lastLoggedIn: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String // Stores device or browser information
  }
});

/**
 * Set the autoCreate option on models if not on production
 */
loginSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Set the TTL index for the `loginTime` field to expire.
 */
loginSchema.index(
  { lastLoggedIn: 1 },
  { expireAfterSeconds: 180 * 24 * 60 * 60 }
); // 180 days in seconds

/**
 * Create Code model out of loginSchema
 */
const Login = model('Login', loginSchema);

export default Login;
