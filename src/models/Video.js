'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//VIDEO SCHEMA
//  ============================================
const videoSchema = new Schema(
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
    thumbnail: {
      type: String,
      required: true
    },
    videoKey: {
      type: String,
      required: true
    },
    thumbnailKey: {
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
    views: {
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
videoSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments videoId everytime an instances is created
 */
videoSchema.plugin(autoIncrement, { inc_field: 'videoId' });

/**
 * Creates index in database for userId
 */
videoSchema.index({ videoId: 1 });

/**
 * Create Video model out of videoSchema
 */
const Video = model('Video', videoSchema);

export default Video;
