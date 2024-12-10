'use strict';

import express from 'express';
import { PermissionController } from '../controllers';
import {
  hasPermissionHandler,
  validateAuthorizationTokenHandler,
  validationHandler
} from '../middlewares';
import {
  permissionIdParamValidation,
  permissionPostValidation,
  permissionQueryValidation,
  permissionUpdateValidation
} from '../validations/permissions';

const { Router } = express;
const router = Router();

router.get(
  '/getPermissions',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  permissionQueryValidation,
  validationHandler,
  PermissionController.getPermissions
);

router.get(
  '/getPermission/:permissionId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  permissionIdParamValidation,
  validationHandler,
  PermissionController.getPermission
);

router.post(
  '/createPermission',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  permissionPostValidation,
  validationHandler,
  PermissionController.createPermission
);

router.put(
  '/updatePermission/:permissionId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  permissionUpdateValidation,
  validationHandler,
  PermissionController.updatePermission
);

router.delete(
  '/deletePermission/:permissionId',
  validateAuthorizationTokenHandler,
  hasPermissionHandler(['SYSTEM_ADMIN']),
  permissionIdParamValidation,
  validationHandler,
  PermissionController.deletePermission
);

export default router;
