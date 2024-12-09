'use strict';

import logger from '../logger';
import models from '../models';
import { convertArgToBoolean } from '../utilities/boolean';
import { getRoles } from './roles';

export const getUsers = async query => {
  try {
    const { User } = models;
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
    const users = await User.find(search, null, options).lean().exec();
    const total = await User.countDocuments(search);

    const result = users.map(user => ({
      ...user,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }

    return [new Error('No users found with selected query params')];
  } catch (err) {
    logger.error('Error getting user data from db: ', err);
    return [new Error('Error getting user data from db')];
  }
};

export const getUserById = async userId => {
  try {
    const { User } = models;
    const user = await User.findOne({ userId });
    if (user) {
      return [null, user];
    }
    return [new Error('User with id does not exist.')];
  } catch (err) {
    logger.error('Error getting user data to db: ', err);
  }
};

export const getUserByEmail = async email => {
  try {
    const { User } = models;
    const user = await User.findOne({ email });
    if (user) {
      return [null, user];
    }
    return [new Error('Unable to find user with email provided.')];
  } catch (err) {
    logger.error('Error getting user data to db: ', err);
    return [new Error('No user found associated with email provided.')];
  }
};

export const createUser = async payload => {
  try {
    const { User } = models;
    const { email, role } = payload;

    const roles = await getRoles({});
    const validRoles = roles.map(role => role.value);

    if (!validRoles.includes(role)) {
      return [new Error('Role provided does not exist.')];
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return [new Error('User with email already exists.')];
    }

    const user = new User(payload);
    const createdUser = await user.save();
    return [null, createdUser];
  } catch (err) {
    logger.error('Error saving user data to db: ', err);
  }
};

export const updateUser = async (userId, payload) => {
  try {
    const { User } = models;
    const { email, isAdmin } = payload;
    const user = await User.findOne({ email });
    if (user) {
      return [new Error('Unable to change email. Email already in use.')];
    }
    const filter = { userId };
    const options = { new: true };
    const update = { ...payload, isAdmin: convertArgToBoolean(isAdmin) };
    const updatedUser = await User.findOneAndUpdate(filter, update, options);
    if (updatedUser) {
      const { email, fullName, city, state, isAdmin } = updatedUser;
      const user = {
        email,
        fullName,
        city,
        state,
        isAdmin
      };
      return [null, user];
    } else {
      return [new Error('Unable to update user details.')];
    }
  } catch (err) {
    logger.error('Error updating user data to db: ', err);
  }
};

export const updateLastLogin = async userId => {
  const { User } = models;
  try {
    const filter = { userId };
    const update = { lastLoggedIn: new Date() };
    const options = { new: true };
    const user = await User.findOneAndUpdate(filter, update, options);
    return [null, user];
  } catch (err) {
    console.log(err);
    return [new Error('Unable to update user last login details.')];
  }
};

export const deleteUserById = async userId => {
  try {
    const { User } = models;
    const deletedUser = await User.deleteOne({ userId });
    if (deletedUser.deletedCount > 0) {
      return [null, deletedUser];
    }
    return [new Error('Unable to find user to delete details.')];
  } catch (err) {
    logger.error('Error deleting user data from db: ', err);
  }
};
