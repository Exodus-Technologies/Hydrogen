'use strict';

import logger from '../logger';
import { PermissionService } from '../services';

exports.getPermissions = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await PermissionService.getPermissions(query);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with getting permissions: ${err.message}`);
    next(err);
  }
};

exports.getPermission = async (req, res, next) => {
  try {
    const { permissionId } = req.params;
    const [statusCode, response] = await PermissionService.getPermission(
      permissionId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with getting permission metadata by id: ${permissionId}: ${err.message}`
    );
    next(err);
  }
};

exports.createPermission = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await PermissionService.createPermission(
      body
    );
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with creating new permission: ${err.message}`);
    next(err);
  }
};

exports.updatePermission = async (req, res, next) => {
  try {
    const { permissionId } = req.params;
    const { body } = req;
    const [statusCode, response] = await PermissionService.updatePermission(
      permissionId,
      body
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating permission: ${err.message}`);
    next(err);
  }
};

exports.deletePermission = async (req, res, next) => {
  try {
    const { permissionId } = req.params;
    const [statusCode, response] = await PermissionService.deletePermission(
      permissionId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with deleting permission by id: ${permissionId}: ${err.message}`
    );
    next(err);
  }
};
