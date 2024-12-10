'use strict';

import logger from '../logger';
import models from '../models';

export const getPermissions = async query => {
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
    logger.error('Error getting permission data from db: ', err);
  }
};

export const getPermissionById = async permissionId => {
  try {
    const { Permission } = models;
    const permission = await Permission.findOne({ permissionId });
    return permission;
  } catch (err) {
    logger.error('Error getting permission data from db by id: ', err);
  }
};

export const getPermissionByName = async name => {
  try {
    const { Permission } = models;
    const permission = await Permission.findOne({ name });
    return permission;
  } catch (err) {
    logger.error('Error getting permission data from db by name: ', err);
  }
};

export const createPermission = async payload => {
  try {
    const { Permission } = models;
    const permission = await Permission.findOne({ name: payload.name });
    if (permission) {
      return [new Error('Permission with name already exists.')];
    }
    const perm = new Permission(payload);
    const createdPermission = await perm.save();
    const { description, name, permissionId } = createdPermission;
    return [null, { description, name, permissionId }];
  } catch (err) {
    logger.error('Error saving permission data to db: ', err);
  }
};

export const updatePermission = async (permissionId, payload) => {
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
    logger.error('Error updating permission data to db: ', err);
  }
};

export const deletePermission = async permissionId => {
  try {
    const { Permission } = models;
    const deletedPermission = await Permission.deleteOne({ permissionId });
    if (deletedPermission.deletedCount > 0) {
      return [null, deletedPermission];
    }
    return [new Error('Unable to find permission to delete details.')()];
  } catch (err) {
    logger.error('Error deleting permission by id: ', err);
  }
};
