'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const tagQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for tags.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for tags.')
];

const tagPostValidation = [
  body('name').isString().withMessage('Must provide a tag name.'),
  body('value').isString().withMessage('Must provide a value for the role.'),
  body('description').isString().withMessage('Must provide a tag description.')
];

const tagIdParamValidation = [
  param('tagId').isString().withMessage('Must provide a existing tag id.')
];

const tagUpdateValidation = [
  param('tagId').isString().withMessage('Must provide a existing tag id.'),
  body('name').isString().optional().withMessage('Must provide a tag name.'),
  body('value')
    .isString()
    .optional()
    .withMessage('Must provide a value for the role.'),
  body('description')
    .isString()
    .optional()
    .withMessage('Must provide a tag description.')
];

export {
  tagIdParamValidation,
  tagPostValidation,
  tagQueryValidation,
  tagUpdateValidation
};
