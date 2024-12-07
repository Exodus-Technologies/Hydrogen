'use strict';

import mongoose from 'mongoose';
import config from '../config';
import logger from '../logger';
import models from '../models';

const { CLUSTER_DOMAIN } = config.sources.database;

/**
 * Set event listener to mongoose.connection on error
 */
mongoose.connection.on('error', error => {
  logger.error(error);
});

/**
 * Set event listener to mongoose.connection on open
 */
mongoose.connection.on('open', () => {
  logger.info(`Connected to ${CLUSTER_DOMAIN}....`);
});

/**
 * Set event listener to mongoose.connection on disconnect
 */
mongoose.connection.on('disconnected', () => {
  logger.info(`Disconnected from ${CLUSTER_DOMAIN}....`);
});

/**
 * This warning message is indicating that the Mongoose library is currently using the "strictQuery" option and that this option will be switched back to "false" in Mongoose 7 by default.
 * Mongoose uses this option to determine whether to enforce strict query syntax. When set to "false", Mongoose will allow query conditions to match multiple properties.
 * To resolve this warning, you can either set "strictQuery" to "false" in your code by using the following line:
 */
mongoose.set('strictQuery', false);

/**
 * Mongoose singleton object to connect.
 */
const source = mongoose;

/**
 * Helper functions for the database
 */

export const getDatabaseConnectionString = () => {
  //Generate database string url with environment variables
  const {
    CLUSTER_DOMAIN,
    DB_NAME,
    DB_PASS: dbPass,
    DB_USER: dbUser,
    DB_APP_NAME: dbAppName
  } = config.sources.database;
  return `mongodb+srv://${dbUser}:${dbPass}@${CLUSTER_DOMAIN}/${DB_NAME}?retryWrites=true&w=majority&appName=${dbAppName}`;
};

export const closeDatabaseConnections = () => {
  //Close active connections to db
  return source.disconnect();
};

export const gracefulExit = () => {
  //Gracefully shuts down application by disconnecting from all active connections to db and then process.exit(0)
  logger.info('Shutting down application.');
  closeDatabaseConnections().then(() => {
    process.exit(0);
  });
};

export const seedPermissions = async () => {
  const { Permission } = models;
  const permissions = [
    {
      name: 'Create Content',
      value: 'CONTENT_CREATE',
      description: 'Create content'
    },
    {
      name: 'View Content',
      value: 'CONTENT_VIEW',
      description: 'View content'
    },
    {
      name: 'Update Content',
      value: 'CONTENT_UPDATE',
      description: 'Update content'
    },
    {
      name: 'Delete Content',
      value: 'CONTENT_DELETE',
      description: 'Delete content'
    },
    {
      name: 'Configure System',
      value: 'SYSTEM_CONFIGURE',
      description: 'Configure System'
    },
    {
      name: 'Create Profile',
      value: 'PROFILE_CREATE',
      description: 'Create profile'
    },
    {
      name: 'MANAGE USERS',
      value: 'MANAGE_USERS',
      description: 'Manage user profiles'
    },
    {
      name: 'Update Profile',
      value: 'PROFILE_UPDATE',
      description: 'Update profile'
    },
    {
      name: 'Delete Profile',
      value: 'PROFILE_DELETE',
      description: 'Delete profile'
    },
    {
      name: 'View Analytics',
      value: 'ANALYTICS_VIEW',
      description: 'View analytics'
    },
    {
      name: 'View Financial',
      value: 'VIEW_FINANCIALS',
      description: 'Financial view'
    },
    {
      name: 'Project Create',
      value: 'PROJECT_CREATE',
      description: 'Project create'
    },
    {
      name: 'Project Update',
      value: 'PROJECT_UPDATE',
      description: 'Project update'
    },
    {
      name: 'Project Delete',
      value: 'PROJECT_DELETE',
      description: 'Project delete'
    },
    {
      name: 'Create Event',
      value: 'EVENT_CREATE',
      description: 'Create events'
    },
    {
      name: 'Event Update',
      value: 'EVENT_UPDATE',
      description: 'Update events'
    },
    {
      name: 'Delete Event',
      value: 'EVENT_DELETE',
      description: 'Delete events'
    }
  ];

  try {
    const count = await Permission.countDocuments();
    if (count === 0) {
      permissions.forEach(async permission => {
        await new Permission(permission).save();
      });
      logger.info(
        `Data seeded successfully for collection: ${Permission.modelName}`
      );
    } else {
      logger.info(
        `${Permission.modelName} collection already has data, skipping seeding....`
      );
    }
  } catch (error) {
    logger.error(`Error seeding permissions: ${error.message}`);
  }
};

export const seedRoles = async () => {
  const { Role } = models;
  const roles = [
    {
      name: 'Admin',
      value: 'ADMIN',
      description: 'Admin User',
      permissions: ['create', 'read', 'update', 'delete']
    },
    {
      name: 'Artist',
      value: 'ARTIST',
      description: 'Artist User',
      permissions: ['create', 'read', 'update']
    },
    {
      name: 'Subscriber',
      value: 'SUBSCRIBER',
      description: 'Fan',
      permissions: ['USER_READ', 'USER_UPDATE']
    }
  ];

  try {
    const count = await Role.countDocuments();
    if (count === 0) {
      roles.forEach(async role => {
        await new Role(role).save();
      });
      logger.info(`Data seeded successfully for collection: ${Role.modelName}`);
    } else {
      logger.info(
        `${Role.modelName} collection already has data, skipping seeding....`
      );
    }
  } catch (error) {
    logger.error(`Error seeding roles: ${error.message}`);
  }
};

export const seedUsers = async () => {
  const { User } = models;
  const users = [];

  try {
    const count = await User.countDocuments();
    if (count === 0) {
      users.forEach(async user => {
        await new User(user).save();
      });
      logger.info(`Data seeded successfully for collection: ${Role.modelName}`);
    } else {
      logger.info(
        `${Role.modelName} collection already has data, skipping seeding....`
      );
    }
  } catch (error) {
    logger.error(`Error seeding users: ${error.message}`);
  }
};

export default source;
