'use strict';

import express from 'express';
import { UserController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  userCreationValidation,
  userIdParamValidation,
  userQueryValidation,
  userUpdateValidation
} from '../validations/users';

const { Router } = express;
const router = Router();

router.get(
  '/getUsers',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'MANAGE_USERS']),
  userQueryValidation,
  validationHandler,
  UserController.getUsers
);

router.get(
  '/getUser/:userId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'MANAGE_USERS', 'PROFILE_EDIT']),
  userIdParamValidation,
  validationHandler,
  UserController.getUser
);

router.post(
  '/createUser',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'MANAGE_USERS', 'PROFILE_CREATE']),
  userCreationValidation,
  validationHandler,
  UserController.createUser
);

router.put(
  '/updateUser/:userId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'MANAGE_USERS', 'PROFILE_EDIT']),
  userUpdateValidation,
  validationHandler,
  UserController.updateUser
);

router.delete(
  '/deleteUser/:userId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN', 'MANAGE_USERS', 'PROFILE_DELETE']),
  userIdParamValidation,
  validationHandler,
  UserController.deleteUser
);

export default router;
