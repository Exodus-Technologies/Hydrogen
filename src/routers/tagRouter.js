'use strict';

import express from 'express';
import { TagController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  tagIdParamValidation,
  tagPostValidation,
  tagQueryValidation,
  tagUpdateValidation
} from '../validations/tags';

const { Router } = express;
const router = Router();

router.get(
  '/getTags',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'TAG_VIEW']),
  tagQueryValidation,
  validationHandler,
  TagController.getTags
);

router.get(
  '/getTag/:tagId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'TAG_VIEW']),
  tagIdParamValidation,
  validationHandler,
  TagController.getTag
);

router.post(
  '/createTag',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'TAG_CREATE']),
  tagPostValidation,
  validationHandler,
  TagController.createTag
);

router.put(
  '/updateTag/:tagId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'TAG_UPDATE']),
  tagUpdateValidation,
  validationHandler,
  TagController.updateTag
);

router.delete(
  '/deleteTag/:tagId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'TAG_DELETE']),
  tagIdParamValidation,
  validationHandler,
  TagController.deleteTag
);

export default router;
