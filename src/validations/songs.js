'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const songQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for songs.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for songs.')
];

const songIdBodyUpdateValidation = [
  body('songId').isString().withMessage('Must provide a existing song id.')
];

const songIdParamValidation = [
  param('songId').isString().withMessage('Must provide a existing song id.')
];

const uploadSongBodyValidation = [
  body('title')
    .isString()
    .withMessage('Must provide a title for manual upload.'),
  body('description')
    .isString()
    .withMessage('Must provide a description for manual upload.'),
  body('tags').isString().withMessage('Must provide tags for manual upload.'),
  body('url').isString().withMessage('Must provide the song url for upload.'),
  body('duration')
    .isString()
    .withMessage('Must provide the duration of the song upload.'),
  body('songKey')
    .isString()
    .withMessage('Must provide the song key for s3 location.'),
  body('coverImage')
    .isString()
    .withMessage('Must provide coverImage for manual upload.'),
  body('coverImageKey')
    .isString()
    .withMessage('Must provide the coverImage key for s3 location.')
];

const updateSongBodyValidation = [
  body('songId').isNumeric().withMessage('Must provide a existing song id.'),
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
    .withMessage('Must provide the song url for upload.')
    .optional(),
  body('duration')
    .isString()
    .withMessage('Must provide the duration of the song upload.')
    .optional(),
  body('songKey')
    .isString()
    .withMessage('Must provide the song key for s3 location.')
    .optional(),
  body('coverImage')
    .isString()
    .withMessage('Must provide coverImage for manual upload.')
    .optional(),
  body('coverImageKey')
    .isString()
    .withMessage('Must provide the coverImage key for s3 location.')
    .optional(),
  body('status')
    .isString()
    .withMessage('Must provide the coverImage key for s3 location.')
    .optional()
];

export {
  songIdBodyUpdateValidation,
  songIdParamValidation,
  songQueryValidation,
  updateSongBodyValidation,
  uploadSongBodyValidation
};
