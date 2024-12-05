'use strict';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import config from '../config';
import { STATES } from '../constants';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);
const { HASH_SALT } = config;

//USER SCHEMA
//  ============================================
const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      index: true
    },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    dob: { type: String },
    gender: { type: String },
    city: { type: String },
    state: {
      type: String,
      enum: STATES
    },
    zipCode: { type: String },
    isAdmin: {
      type: Boolean,
      default: false
    },
    lastLoggedIn: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
);

//HASH PASSWORD
// ============================================

const getHashedPassword = password => {
  //Generate Salt
  const salt = bcrypt.genSaltSync(HASH_SALT);
  return bcrypt.hashSync(password, salt);
};

//Hash password before saving
userSchema.pre('save', function (next) {
  const user = this;

  //Hash password only if the password has been changed or is new
  if (!user.isModified('password')) return next();
  user.password = getHashedPassword(user.password);
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const user = this;
  try {
    //Hash password only if the password has been changed or is new
    if (user.password) {
      if (user.isModified('password')) {
        user.password = getHashedPassword(user.password);
      }
      return next();
    }

    const { password } = user.getUpdate()?.$set;
    if (password) {
      user._update.password = getHashedPassword(password);
    }
    next();
  } catch (err) {
    return next(err);
  }
});

//Create method to compare a given password with the database hash
userSchema.methods.getIsValidPassword = function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

/**
 * Set the autoCreate option on models if not on production
 */
userSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments userId everytime an instances is created
 */
userSchema.plugin(autoIncrement, { inc_field: 'userId' });

/**
 * Creates index in database for userId
 */
userSchema.index({ userId: 1 });

/**
 * Create User model out of userSchema
 */
const User = model('User', userSchema);

export default User;
