import express from 'express';
import { VideoController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  updateVideoBodyValidation,
  uploadVideoBodyValidation,
  videoIdBodyUpdateValidation,
  videoIdParamValidation,
  videoQueryValidation
} from '../validations/videos';

const { Router } = express;
const router = Router();

router.get(
  '/getVideos',
  videoQueryValidation,
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_VIEW']),
  validationHandler,
  VideoController.getVideos
);

router.get(
  '/getVideo/:videoId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_VIEW']),
  videoIdParamValidation,
  validationHandler,
  VideoController.getVideo
);

router.post(
  '/uploadVideo',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_CREATE']),
  uploadVideoBodyValidation,
  validationHandler,
  VideoController.uploadVideo
);

router.put(
  '/updateVideo',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_UPDATE']),
  updateVideoBodyValidation,
  validationHandler,
  VideoController.updateVideo
);

router.put(
  '/updateViews',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_INTERACT']),
  videoIdBodyUpdateValidation,
  validationHandler,
  VideoController.updateViews
);

router.delete(
  '/deleteVideo/:videoId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_DELETE']),
  videoIdParamValidation,
  validationHandler,
  VideoController.deleteVideo
);

export default router;
