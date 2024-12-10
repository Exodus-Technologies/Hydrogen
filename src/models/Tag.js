'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//PERMISSION SCHEMA
//  ============================================
const tagSchema = new Schema(
  {
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
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
tagSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments tagId everytime an instances is created
 */
tagSchema.plugin(autoIncrement, { inc_field: 'tagId' });

/**
 * Creates index in database for tagId
 */
tagSchema.index({ tagId: 1 });

/**
 * Create Permission model out of tagSchema
 */
const Tag = model('Tag', tagSchema);

export default Tag;
