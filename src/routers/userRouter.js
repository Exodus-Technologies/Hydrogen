'use strict';

import express from 'express';
import { UserController } from '../controllers';
import { validationHandler } from '../middlewares';
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
  userQueryValidation,
  validationHandler,
  UserController.getUsers
);

router.get(
  '/getUser/:userId',
  userIdParamValidation,
  validationHandler,
  UserController.getUser
);

router.post(
  '/createUser',
  userCreationValidation,
  validationHandler,
  UserController.createUser
);

router.put(
  '/updateUser/:userId',
  userUpdateValidation,
  validationHandler,
  UserController.updateUser
);

router.delete(
  '/deleteUser/:userId',
  userIdParamValidation,
  validationHandler,
  UserController.deleteUser
);

export default router;
