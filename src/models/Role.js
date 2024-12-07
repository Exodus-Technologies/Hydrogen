'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;

const autoIncrement = mongooseSequence(mongoose);

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  permissions: [
    {
      type: String,
      required: true
    }
  ]
});

/**
 * Set the autoCreate option on models if not on production
 */
roleSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments roleId everytime an instances is created
 */
roleSchema.plugin(autoIncrement, { inc_field: 'roleId' });

/**
 * Creates index in database for userId
 */
roleSchema.index({ roleId: 1 });

const Role = model('Role', roleSchema);

export default Role;
