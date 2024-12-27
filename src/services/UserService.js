'use strict';

import logger from '../logger';
import { UserRepository } from '../repository';
import {
  HttpStatusCodes,
  badRequest,
  internalServerErrorRequest
} from '../response-codes';

exports.getUsers = async query => {
  try {
    const [error, users] = await UserRepository.getUsers(query);
    if (users) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'Fetcing of users action was successful.',
          users
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting all users: ${err.message}`);
    return internalServerErrorRequest('Error getting users.');
  }
};

exports.getUser = async userId => {
  try {
    const [error, user] = await UserRepository.getUser(userId);
    if (user) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'User was successfully fetched.',
          user
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.error(err);
    logger.error(`Error getting user: ${err.message}`);
    return internalServerErrorRequest('Error getting user.');
  }
};

exports.createUser = async payload => {
  try {
    const [error, user] = await UserRepository.createUser(payload);
    if (user) {
      return [
        HttpStatusCodes.CREATED,
        {
          message: 'User created with success.',
          user
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error creating user: ${err.message}`);
    return internalServerErrorRequest('Error creating user.');
  }
};

exports.updateUser = async (userId, payload) => {
  try {
    const [error, updatedUser] = await UserRepository.updateUser(
      userId,
      payload
    );
    if (updatedUser) {
      return [
        HttpStatusCodes.OK,
        { message: 'User was successfully updated.', user: updatedUser }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.error(err);
    logger.error(`Error updating user: ${err.message}`);
    return internalServerErrorRequest('Error updating user.');
  }
};

exports.deleteUser = async userId => {
  try {
    const [error, user] = await UserRepository.getUser(userId);
    if (user) {
      const [error, deletedUser] = await UserRepository.deleteUser(userId);
      if (deletedUser) {
        return [HttpStatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(error.message);
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting user by id: ${err.message}`);
    return internalServerErrorRequest('Error deleting user by id.');
  }
};
