'use strict';

import logger from '../logger';
import models from '../models';

export const getRoles = async query => {
  try {
    const { Role } = models;
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
    const roles = await Role.find(search, null, options).lean().exec();
    const total = await Role.countDocuments(search);

    const result = roles.map(role => ({
      ...role,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting role data from db: ${err.message}`);
    return [new Error('Unable to get role data from db.')];
  }
};

export const getRoleById = async roleId => {
  try {
    const { Role } = models;
    const role = await Role.findOne({ roleId });
    return role;
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting role data from db by id ${roleId}: ${err.message}`
    );
    return [new Error('Unable to get role data from db by id.')];
  }
};

export const getRoleByName = async name => {
  try {
    const { Role } = models;
    const role = await Role.findOne({ name });
    return role;
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting role data from db by name ${name}: ${err.message}`
    );
    return [new Error('Unable to get role data from db by name.')];
  }
};

export const createRole = async payload => {
  try {
    const { Role } = models;
    const role = await Role.findOne({ name: payload.name });
    if (role) {
      return [new Error('Role with name already exists.')];
    }
    const r = new Role(payload);
    const createdRole = await r.save();
    const { description, name, roleId } = createdRole;
    return [null, { description, name, roleId }];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving role data to db: ${err.message}`);
    return [new Error('Unable to save data to db.')];
  }
};

export const updateRole = async (roleId, payload) => {
  try {
    const { Role } = models;
    const filter = { roleId };
    const options = { new: true };
    const update = { ...payload };
    const role = await Role.findOneAndUpdate(filter, update, options);
    return [null, role];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error update role data to db by id ${roleId}: ${err.message}`
    );
    return [new Error('Unable to update role data to db.')];
  }
};

export const deleteRole = async roleId => {
  try {
    const { Role } = models;
    const deletedRole = await Role.deleteOne({ roleId });
    if (deletedRole.deletedCount > 0) {
      return [null, deletedRole];
    }
    return [new Error('Unable to find role to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error deleting role data from db by id ${roleId}: ${err.message}`
    );
    return [new Error('Unable to delete role data from db.')];
  }
};
