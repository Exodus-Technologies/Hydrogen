'use strict';

import logger from '../logger';
import models from '../models';

exports.getSongs = async query => {
  try {
    const { Song } = models;
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
    const songs = await Song.find(search, null, options).lean().exec();
    const total = await Song.countDocuments(search);

    const result = songs.map(song => ({
      ...song,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting role data from db: ${err.message}`);
    return [new Error('Unable to get song data from db.')];
  }
};

exports.getSongByTitle = async title => {
  try {
    const { Song } = models;
    const song = await Song.findOne({ title });
    return [null, song];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting song data from db by title ${title}: ${err.message}`
    );
    return [new Error('Unable to get song data from db by title.')];
  }
};

exports.getSong = async songId => {
  try {
    const { Song } = models;
    const song = await Song.findOne({ songId });
    return [null, song];
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting total song data from db by id ${roleId}: ${err.message}`
    );
    return [new Error('Unable to get song data from db by id.')];
  }
};

exports.createSong = async payload => {
  try {
    const { Song } = models;
    const song = new Song(payload);
    const createdSong = await song.save();
    return [null, createdSong];
  } catch (err) {
    console.error(err);
    logger.error(`Error creating song data: ${err.message}`);
    return [new Error('Error saving song data to db.')];
  }
};

exports.updateSong = async payload => {
  try {
    const { Song } = models;
    const { songId } = payload;
    const filter = { songId };
    const options = { upsert: true, new: true };
    const update = { ...payload };
    const updatedSong = await Song.findOneAndUpdate(filter, update, options);
    return [null, updatedSong];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating song data to db: ${err.message}`);
    return [new Error('Error updating song data to db.')];
  }
};

exports.updateSongListens = async songId => {
  try {
    const { Song } = models;
    const filter = { songId };
    const update = { $inc: { listens: 1 } };
    const options = { upsert: true, new: true };
    const updatedSong = await Song.findOneAndUpdate(filter, update, options);
    return [null, updatedSong];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating song listens: ${err.message}`);
    return [new Error('Error updating song listens.')];
  }
};

exports.deleteSong = async songId => {
  try {
    const { Song } = models;
    const deletedSong = await Song.deleteOne({ songId });
    if (deletedSong.deletedCount > 0) {
      return [null, deletedSong];
    }
    return [new Error('Unable to find song to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting song by id ${songId}: ${err.message}`);
    return [new Error('Error deleting song by id.')];
  }
};
