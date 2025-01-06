'use strict';

import express from 'express';
import { LoginController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import { userIdParamValidation } from '../validations/users';

const { Router } = express;
const router = Router();

router.get(
  '/getLogins/:userId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'MANAGE_USERS', 'PROFILE_VIEW']),
  userIdParamValidation,
  validationHandler,
  LoginController.getLogins
);

export default router;
