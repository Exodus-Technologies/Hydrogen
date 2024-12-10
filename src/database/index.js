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
      name: 'System Administrator',
      value: 'SYSTEM_ADMIN',
      description: 'System Administrator'
    },
    {
      name: 'Manage Users',
      value: 'MANAGE_USERS',
      description: 'Manage user profiles'
    },
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
      name: 'Interact Content',
      value: 'CONTENT_INTERACT',
      description: 'Interact content'
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
      name: 'Create Tag',
      value: 'TAG_CREATE',
      description: 'Create tags'
    },
    {
      name: 'View Tag',
      value: 'TAG_VIEW',
      description: 'View tags'
    },
    {
      name: 'Update Tag',
      value: 'TAG_UPDATE',
      description: 'Update tags'
    },
    {
      name: 'Delete Tag',
      value: 'TAG_DELETE',
      description: 'Delete tags'
    },
    {
      name: 'Create Profile',
      value: 'PROFILE_CREATE',
      description: 'Create profile'
    },
    {
      name: 'View Profile',
      value: 'PROFILE_VIEW',
      description: 'View profile'
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
      name: 'View Financials',
      value: 'VIEW_FINANCIALS',
      description: 'Financials view'
    },
    {
      name: 'Create Projects',
      value: 'PROJECT_CREATE',
      description: 'Project create'
    },
    {
      name: 'View Projects',
      value: 'PROJECTS_VIEW',
      description: 'Projects view'
    },
    {
      name: 'Update Projects',
      value: 'PROJECTS_UPDATE',
      description: 'Projects Update'
    },
    {
      name: 'Delete Projects',
      value: 'PROJECTS_DELETE',
      description: 'Projects delete'
    },
    {
      name: 'Create Events',
      value: 'EVENTS_CREATE',
      description: 'Create events'
    },
    {
      name: 'View Events',
      value: 'EVENTS_VIEW',
      description: 'View events'
    },
    {
      name: 'Update Events',
      value: 'EVENTS_UPDATE',
      description: 'Update events'
    },
    {
      name: 'Delete Events',
      value: 'EVENTS_DELETE',
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
  } catch (err) {
    logger.error(`Error seeding permissions: ${err.message}`);
  }
};
/**
 * System Admin > Manager(s) > Content Creator > Fan/Subscriber
 */
export const seedRoles = async () => {
  const { Role } = models;
  const roles = [
    {
      name: 'Admin',
      value: 'ADMIN',
      description:
        'An admin user is an individual or entity with comprehensive access to a system or application, granting them control over critical functions such as user management, system configuration, and data access',
      permissions: ['SYSTEM_ADMIN']
    },
    {
      name: 'Manager',
      value: 'MANAGER',
      description:
        "A manager user typically acts as an intermediary between the system's administrative level and regular users. They have elevated permissions to oversee and manage specific operations or teams but do not have the full range of control that an admin possesses.",
      permissions: [
        'MANAGE_USERS',
        'PROFILE_CREATE',
        'PROFILE_UPDATE',
        'PROFILE_VIEW',
        'PROFILE_DELETE',
        'PROJECT_CREATE',
        'PROJECTS_VIEW',
        'PROJECTS_UPDATE',
        'PROJECTS_DELETE',
        'VIEW_FINANCIALS',
        'CONTENT_VIEW',
        'CONTENT_INTERACT',
        'TAG_VIEW',
        'EVENTS_CREATE',
        'EVENTS_VIEW',
        'EVENTS_UPDATE',
        'EVENTS_DELETE',
        'ANALYTICS_VIEW'
      ]
    },
    {
      name: 'Content Creator',
      value: 'CONTENT_CREATOR',
      description:
        "A Content Creator is a user role focused on generating, curating, and managing content within a platform or system. This role is pivotal in maintaining the platform's relevance, engagement, and value by producing high-quality, targeted materials for the intended audience.",
      permissions: [
        'CONTENT_CREATE',
        'CONTENT_VIEW',
        'CONTENT_INTERACT',
        'CONTENT_UPDATE',
        'CONTENT_DELETE',
        'TAG_CREATE',
        'TAG_VIEW',
        'TAG_UPDATE',
        'TAG_DELETE',
        'PROJECTS_VIEW',
        'EVENTS_VIEW',
        'ANALYTICS_VIEW'
      ]
    },
    {
      name: 'Subscriber',
      value: 'SUBSCRIBER',
      description:
        "A Fan is a user role focused on consuming, interacting with, and engaging with the content or community within a platform. This role is essential for fostering a vibrant and interactive ecosystem, as fans drive the platform's engagement metrics through their activity.",
      permissions: [
        'CONTENT_VIEW',
        'EVENTS_VIEW',
        'CONTENT_INTERACT',
        'CONTENT_VIEW',
        'PROFILE_UPDATE',
        'PROFILE_VIEW'
      ]
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
  } catch (err) {
    logger.error(`Error seeding roles: ${err.message}`);
  }
};

export default source;
