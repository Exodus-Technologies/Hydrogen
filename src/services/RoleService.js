'use strict';

import logger from '../logger';
import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole
} from '../queries/roles';
import {
  HttpStatusCodes,
  badRequest,
  internalServerErrorRequest
} from '../response-codes';

exports.getRoles = async query => {
  try {
    const [error, roles] = await getRoles(query);
    if (roles) {
      return [
        HttpStatusCodes.OK,
        { message: 'Roles fetched from db with success', roles }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting role data fron db: ${err.message}`);
    return internalServerErrorRequest('Error getting roles.');
  }
};

exports.getRole = async roleId => {
  try {
    const [error, role] = await getRole(roleId);
    if (role) {
      return [
        HttpStatusCodes.OK,
        { message: 'Role fetched from db with success', role }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting role data fron db by id ${roleId}: ${err.message}`
    );
    return internalServerErrorRequest('Error getting role by id.');
  }
};

exports.createRole = async payload => {
  try {
    const [error, role] = await createRole(payload);
    if (role) {
      return [
        HttpStatusCodes.CREATED,
        { message: 'Role created with success.', role }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error creating role: ${err.message}`);
    return internalServerErrorRequest('Error creating new role.');
  }
};

exports.updateRole = async (roleId, name) => {
  try {
    const [error, role] = await updateRole(roleId, name);
    if (role) {
      return [
        HttpStatusCodes.OK,
        { message: 'Role updated with success.', role }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error updating role data in db: ${err.message}`);
    return internalServerErrorRequest('Error updating existing role.');
  }
};

exports.deleteRole = async roleId => {
  try {
    const [error, deletedRole] = await deleteRole(roleId);
    if (deletedRole) {
      return [HttpStatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting role data from db ${roleId}: ${err.message}`);
    return internalServerErrorRequest('Error deleting role by id.');
  }
};
