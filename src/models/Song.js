'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//SONG SCHEMA
//  ============================================
const songSchema = new Schema(
  {
    title: {
      type: String,
      index: true,
      required: true,
      unique: true
    },
    url: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      required: true
    },
    songKey: {
      type: String,
      required: true
    },
    coverImageKey: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    listens: {
      type: Number,
      default: 0
    },
    author: {
      type: String
    },
    isAvailableForSale: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      default: 'DRAFT'
    },
    tags: {
      type: [String],
      required: true
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
songSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments songId everytime an instances is created
 */
songSchema.plugin(autoIncrement, { inc_field: 'songId' });

/**
 * Creates index in database for userId
 */
songSchema.index({ songId: 1 });

/**
 * Create Song model out of songSchema
 */
const Song = model('Song', songSchema);

export default Song;
