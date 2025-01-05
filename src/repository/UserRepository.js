'use strict';

import logger from '../logger';
import models from '../models';
import RoleRepository from './RoleRepository';

const getIsEmailInUse = async email => {
  try {
    const { User } = models;
    const user = await User.findOne({ email });
    if (user) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting user data from db by email: ${err.message}`);
    return false;
  }
};

exports.getUsers = async query => {
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
    console.error(err);
    logger.error('Error getting user data from db: ', err);
    return [new Error('Error getting user data from db')];
  }
};

exports.getUser = async userId => {
  try {
    const { User } = models;
    const user = await User.findOne({ userId });
    if (user) {
      return [null, user];
    }
    return [new Error('User with id does not exist.')];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting user data from db by id ${userId}: ${err.message}`
    );
    return [new Error('Unable to get user data from db.')];
  }
};

exports.getUserByEmail = async email => {
  try {
    const { User } = models;
    const user = await User.findOne({ email });
    if (user) {
      return [null, user];
    }
    return [new Error('Unable to find user with email provided.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting user data from db by email: ${err.message}`);
    return [new Error('No user found associated with email provided.')];
  }
};

exports.createUser = async body => {
  try {
    const { User } = models;
    const { email, role } = body;

    const isValidRole = RoleRepository.getIsValidRole(role);

    if (!isValidRole) {
      return [new Error('Role provided does not exist.')];
    }

    const existingUser = await getIsEmailInUse(email);
    if (existingUser) {
      return [new Error('User with email already exists.')];
    }

    const user = new User(body);
    const createdUser = await user.save();
    return [null, createdUser];
  } catch (err) {
    console.error(err);
    logger.error(`Error creating user data: ${err.message}`);
    return [new Error('Unable to create user in db.')];
  }
};

exports.updateUser = async (userId, payload) => {
  try {
    const { User } = models;
    const user = await User.findOne({ userId });

    //Looks to see if new email does not existing in the database or conflicts with the existing email.
    if (payload.email && payload.email !== user.email) {
      const existingUser = await getIsEmailInUse(payload.email);
      if (existingUser) {
        return [new Error('Unable to change email. Email already in use.')];
      }
    }

    const isValidRole = RoleRepository.getIsValidRole(payload.role);

    if (!isValidRole) {
      return [new Error('Role provided does not exist.')];
    }

    const filter = { userId };
    const update = { ...payload };
    const options = { upsert: true, new: true };
    const updatedUser = await User.findOneAndUpdate(filter, update, options);
    if (updatedUser) {
      return [null, updatedUser];
    } else {
      return [new Error('Unable to update user details.')];
    }
  } catch (err) {
    console.error(err);
    logger.error(
      `Error updating user data from db by id ${userId}: ${err.message}`
    );
    return [new Error('Unable to update user data.')];
  }
};

exports.updateLastLogin = async userId => {
  try {
    const { User } = models;
    const filter = { userId };
    const update = { lastLoggedIn: new Date() };
    const options = { upsert: true, new: true };
    const user = await User.findOneAndUpdate(filter, update, options);
    return [null, user];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error updating user data in db by id ${userId}: ${err.message}`
    );
    return [new Error('Unable to update user last login details.')];
  }
};

exports.deleteUser = async userId => {
  try {
    const { User } = models;
    const deletedUser = await User.deleteOne({ userId });
    if (deletedUser.deletedCount > 0) {
      return [null, deletedUser];
    }
    return [new Error('Unable to find user to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error deleting user data in db by id ${userId}: ${err.message}`
    );
    return [new Error('Unable to delete user data.')];
  }
};
