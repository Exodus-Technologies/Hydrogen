'use strict';

import logger from '../logger';
import { VideoService } from '../services';

exports.getVideos = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await VideoService.getVideos(query);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting vidoes: ${err.message}`);
    next(err);
  }
};

exports.getVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const [statusCode, response] = await VideoService.getVideo(videoId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting video by id: ${videoId}: ${err.message}`);
    next(err);
  }
};

exports.uploadVideo = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await VideoService.uploadVideo(body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with uploading video: ${err.message}`);
    next(err);
  }
};

exports.updateVideo = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await VideoService.updateVideo(body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating video: ${err.message}`);
    next(err);
  }
};

exports.updateViews = async (req, res, next) => {
  try {
    const { videoId } = req.body;
    const [statusCode, response] = await VideoService.updateViews(videoId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with updating views for video ${videoId}: ${err.message}`
    );
    next(err);
  }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const [statusCode, response] = await VideoService.deleteVideo(videoId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with deleting video by id: ${videoId}: ${err.message}`);
    next(err);
  }
};
