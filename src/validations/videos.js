'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';
/**
 * title: {
      type: String,
      index: true,
      required: true,
      unique: true
    },
    url: {
      type: String,
      required: true
    },
    videoKey: {
      type: String,
      required: true
    },
    thumbnail: {
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
    duration: {
      type: String
    },
    status: {
      type: String,
      default: 'DRAFT'
    },
    tags: {
      type: [String]
    }
 */

const videoQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for videos.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for videos.')
];

const videoIdBodyUpdateValidation = [
  body('videoId').isString().withMessage('Must provide a existing video id.')
];

const videoIdParamValidation = [
  param('videoId').isString().withMessage('Must provide a existing video id.')
];

const uploadVideoBodyValidation = [
  body('title')
    .isString()
    .withMessage('Must provide a title for manual upload.'),
  body('description')
    .isString()
    .withMessage('Must provide a description for manual upload.'),
  body('tags').isString().withMessage('Must provide tags for manual upload.'),
  body('url').isString().withMessage('Must provide the video url for upload.'),
  body('duration')
    .isString()
    .withMessage('Must provide the duration of the video upload.'),
  body('videoKey')
    .isString()
    .withMessage('Must provide the video key for s3 location.'),
  body('thumbnail')
    .isString()
    .withMessage('Must provide thumbnail for manual upload.'),
  body('thumbnailKey')
    .isString()
    .withMessage('Must provide the thumbnail key for s3 location.')
];

const updateVideoBodyValidation = [
  body('videoId').isString().withMessage('Must provide a existing video id.'),
  body('title')
    .isString()
    .withMessage('Must provide a title for manual upload.')
    .optional(),
  body('description')
    .isString()
    .withMessage('Must provide a description for manual upload.')
    .optional(),
  body('tags')
    .isString()
    .withMessage('Must provide tags for manual upload.')
    .optional(),
  body('url')
    .isString()
    .withMessage('Must provide the video url for upload.')
    .optional(),
  body('duration')
    .isString()
    .withMessage('Must provide the duration of the video upload.')
    .optional(),
  body('videoKey')
    .isString()
    .withMessage('Must provide the video key for s3 location.')
    .optional(),
  body('thumbnail')
    .isString()
    .withMessage('Must provide thumbnail for manual upload.')
    .optional(),
  body('thumbnailKey')
    .isString()
    .withMessage('Must provide the thumbnail key for s3 location.')
    .optional(),
  body('status')
    .isString()
    .withMessage('Must provide the thumbnail key for s3 location.')
    .optional()
];

export {
  updateVideoBodyValidation,
  uploadVideoBodyValidation,
  videoIdBodyUpdateValidation,
  videoIdParamValidation,
  videoQueryValidation
};
