'use strict';

import logger from '../logger';
import { TagService } from '../services';

exports.getTags = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await TagService.getTags(query);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with getting tags: ${err.message}`);
    next(err);
  }
};

exports.getTag = async (req, res, next) => {
  const { tagId } = req.params;
  try {
    const [statusCode, response] = await TagService.getTag(tagId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with getting tag metadata by id: ${tagId}: ${err.message}`
    );
    next(err);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await TagService.createTag(body);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with creating new tag: ${err.message}`);
    next(err);
  }
};

exports.updateTag = async (req, res, next) => {
  try {
    const { tagId } = req.params;
    const { name } = req.body;
    const [statusCode, response] = await TagService.updateTag(tagId, name);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating tag ${tagId}: ${err.message}`);
    next(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  const { tagId } = req.params;
  try {
    const [statusCode, response] = await TagService.deleteTag(tagId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with deleting tag by id: ${tagId}: ${err.message}`);
    next(err);
  }
};
