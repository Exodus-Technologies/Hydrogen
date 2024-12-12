'use strict';

import logger from '../logger';
import models from '../models';

export const getVideos = async query => {
  try {
    const { Video } = models;
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
    const users = await Video.find(search, null, options).lean().exec();
    const total = await Video.countDocuments(search);

    const result = users.map(user => ({
      ...user,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting role data from db: ${err.message}`);
    return [new Error('Unable to get video data from db.')];
  }
};

export const getVideoByTitle = async title => {
  try {
    const { Video } = models;
    const video = await Video.findOne({ title });
    return [null, video];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting total video data from db by title ${title}: ${err.message}`
    );
    return [new Error('Unable to get video data from db by title.')];
  }
};

export const getVideo = async videoId => {
  try {
    const { Video } = models;
    const video = await Video.findOne({ videoId });
    return [null, video];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting total video data from db by id ${roleId}: ${err.message}`
    );
    return [new Error('Unable to get video data from db by id.')];
  }
};

export const createVideo = async payload => {
  try {
    const { Video } = models;
    const video = new Video(payload);
    const createdVideo = await video.save();
    return [null, createdVideo];
  } catch (err) {
    console.error(err);
    logger.error(`Error creating video data: ${err.message}`);
    return [new Error('Error saving video data to db.')];
  }
};

export const updateVideo = async payload => {
  try {
    const { Video } = models;
    const { videoId } = payload;
    const filter = { videoId };
    const options = { upsert: true };
    const update = { ...payload };
    const updatedVideo = await Video.findOneAndUpdate(filter, update, options);
    return [null, updatedVideo];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating video data to db: ${err.message}`);
    return [new Error('Error updating video data to db.')];
  }
};

export const updateVideoViews = async videoId => {
  try {
    const { Video } = models;
    const updatedVideo = await Video.findOneAndUpdate(filter, update, options);
    return [null, updatedVideo];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating video views: ${err.message}`);
    return [new Error('Error updating video views.')];
  }
};

export const deleteVideo = async videoId => {
  try {
    const { Video } = models;
    const deletedVideo = await Video.deleteOne({ videoId });
    if (deletedVideo.deletedCount > 0) {
      return [null, deletedVideo];
    }
    return [new Error('Unable to find video to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting video by id ${videoId}: ${err.message}`);
    return [new Error('Error deleting video by id.')];
  }
};
