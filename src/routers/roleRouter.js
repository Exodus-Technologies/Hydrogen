'use strict';

import express from 'express';
import { RoleController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  roleIdParamValidation,
  rolePostValidation,
  roleQueryValidation,
  roleUpdateValidation
} from '../validations/roles';

const { Router } = express;
const router = Router();

router.get(
  '/getRoles',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  roleQueryValidation,
  validationHandler,
  RoleController.getRoles
);

router.get(
  '/getRole/:roleId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  roleIdParamValidation,
  validationHandler,
  RoleController.getRole
);

router.post(
  '/createRole',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  rolePostValidation,
  validationHandler,
  RoleController.createRole
);

router.put(
  '/updateRole/:roleId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  roleUpdateValidation,
  validationHandler,
  RoleController.updateRole
);

router.delete(
  '/deleteRole/:roleId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  roleIdParamValidation,
  validationHandler,
  RoleController.deleteRole
);

export default router;
