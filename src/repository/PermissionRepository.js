'use strict';

import logger from '../logger';
import models from '../models';

exports.getPermissions = async query => {
  try {
    const { Permission } = models;
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      ...filters
    } = query;

    // Build filter query
    const search = {};
    Object.keys(filters).forEach(key => {
      search[key] = new RegExp(filters[key], 'i'); // Regex for partial match (case-insensitive)
    });

    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { [sort]: order === 'asc' ? 1 : -1 }
    };

    // Fetch data and count total documents
    const permissions = await Permission.find(search, null, options)
      .lean()
      .exec();
    const total = await Permission.countDocuments(search);

    const result = permissions.map(permission => ({
      ...permission,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting permission data from db: ${err.message}`);
    return [new Error('Error getting permission data from db')];
  }
};

exports.getPermission = async permissionId => {
  try {
    const { Permission } = models;
    const permission = await Permission.findOne({ permissionId });
    return [null, permission];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting permission data from db by id ${permissionId}: ${err.message}`
    );
    return [new Error('Error getting permission data from db')];
  }
};

exports.getPermissionByName = async name => {
  try {
    const { Permission } = models;
    const permission = await Permission.findOne({ name });
    return [null, permission];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting permission data from db by name ${name}: ${err.message}`
    );
    return [new Error('Error getting permission data from db by name')];
  }
};

exports.createPermission = async payload => {
  try {
    const { Permission } = models;
    const permission = await Permission.findOne({ name: payload.name });
    if (permission) {
      return [new Error('Permission with name already exists.')];
    }
    const perm = new Permission(payload);
    const createdPermission = await perm.save();
    return [null, createdPermission];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving permission data to db: ${err.message}`);
    return [new Error('Error saving permission data to db')];
  }
};

exports.updatePermission = async (permissionId, payload) => {
  try {
    const { Permission } = models;
    const filter = { permissionId };
    const options = { new: true };
    const update = { ...payload };
    const permission = await Permission.findOneAndUpdate(
      filter,
      update,
      options
    );
    return [null, permission];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating permission data to db: ${err.message}`);
    return [new Error('Error updating permission data to db')];
  }
};

exports.deletePermission = async permissionId => {
  try {
    const { Permission } = models;
    const deletedPermission = await Permission.deleteOne({ permissionId });
    if (deletedPermission.deletedCount > 0) {
      return [null, deletedPermission];
    }
    return [new Error('Unable to find permission to delete details.')()];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error deleting permission by id ${permissionId}: ${err.message}`
    );
    return [new Error('Error deleting permission by id')];
  }
};
