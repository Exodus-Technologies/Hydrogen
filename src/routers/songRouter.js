import express from 'express';
import { SongController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  songIdBodyUpdateValidation,
  songIdParamValidation,
  songQueryValidation,
  updateSongBodyValidation,
  uploadSongBodyValidation
} from '../validations/songs';

const { Router } = express;
const router = Router();

router.get(
  '/getSongs',
  songQueryValidation,
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_VIEW']),
  validationHandler,
  SongController.getSongs
);

router.get(
  '/getSong/:songId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_VIEW']),
  songIdParamValidation,
  validationHandler,
  SongController.getSong
);

router.post(
  '/uploadSong',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_CREATE']),
  uploadSongBodyValidation,
  validationHandler,
  SongController.uploadSong
);

router.put(
  '/updateSong',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_UPDATE']),
  updateSongBodyValidation,
  validationHandler,
  SongController.updateSong
);

router.put(
  '/updateListens',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_INTERACT']),
  songIdBodyUpdateValidation,
  validationHandler,
  SongController.updateListens
);

router.delete(
  '/deleteSong/:songId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'CONTENT_DELETE']),
  songIdParamValidation,
  validationHandler,
  SongController.deleteSong
);

export default router;
