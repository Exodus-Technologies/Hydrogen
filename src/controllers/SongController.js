'use strict';

import logger from '../logger';
import { SongService } from '../services';

exports.getSongs = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await SongService.getSongs(query);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting vidoes: ${err.message}`);
    next(err);
  }
};

exports.getSong = async (req, res, next) => {
  const { songId } = req.params;
  try {
    const [statusCode, response] = await SongService.getSong(songId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting song by id: ${songId}: ${err.message}`);
    next(err);
  }
};

exports.uploadSong = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await SongService.uploadSong(body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with uploading song: ${err.message}`);
    next(err);
  }
};

exports.updateSong = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await SongService.updateSong(body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating song: ${err.message}`);
    next(err);
  }
};

exports.updateListens = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const [statusCode, response] = await SongService.updateListens(songId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with updating views for song ${songId}: ${err.message}`
    );
    next(err);
  }
};

exports.deleteSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const [statusCode, response] = await SongService.deleteSong(songId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with deleting song by id: ${songId}: ${err.message}`);
    next(err);
  }
};
