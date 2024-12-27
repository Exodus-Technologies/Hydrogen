'use strict';

import logger from '../logger';
import { PermissionRepository } from '../repository';
import {
  badRequest,
  HttpStatusCodes,
  internalServerErrorRequest
} from '../response-codes';

exports.getPermissions = async query => {
  try {
    const [error, permissions] = await PermissionRepository.getPermissions(
      query
    );
    if (permissions) {
      return [
        HttpStatusCodes.OK,
        { message: 'Permissions fetched from db with success', permissions }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting permissions: ${err.message}`, err);
    return internalServerErrorRequest('Error getting permissions.');
  }
};

exports.getPermission = async permissionId => {
  try {
    const [error, permission] = await PermissionRepository.getPermission(
      permissionId
    );
    if (permission) {
      return [
        HttpStatusCodes.OK,
        { message: 'Permission fetched from db with success', permission }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting permission by id: ${err.message}`);
    return internalServerErrorRequest('Error getting permission by id.');
  }
};

exports.createPermission = async payload => {
  try {
    const [error, permission] = await PermissionRepository.createPermission(
      payload
    );
    if (permission) {
      return [
        HttpStatusCodes.CREATED,
        { message: 'Permission created with success.', permission }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error creating new permission: ${err.message}`);
    return internalServerErrorRequest('Error creating new permission.');
  }
};

exports.updatePermission = async (permissionId, payload) => {
  try {
    const [error, permission] = await PermissionRepository.updatePermission(
      permissionId,
      payload
    );
    if (permission) {
      return [
        HttpStatusCodes.OK,
        { message: 'Permission updated with success.', permission }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error updating existing permission: ${err.message}`);
    return internalServerErrorRequest('Error updating existing permission.');
  }
};

exports.deletePermission = async permissionId => {
  try {
    const [error, deletedPermission] =
      await PermissionRepository.deletePermission(permissionId);
    if (deletedPermission) {
      return [HttpStatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting permission by id: ${err.message}`);
    return internalServerErrorRequest('Error deleting permission by id.');
  }
};
