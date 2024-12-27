'use strict';

import logger from '../logger';
import { TagRepository } from '../repository';
import {
  HttpStatusCodes,
  badRequest,
  internalServerErrorRequest
} from '../response-codes';

exports.getTags = async query => {
  try {
    const [error, tags] = await TagRepository.getTags(query);
    if (tags) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'Fetcing of tags action was successful.',
          tags
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.log(err);
    logger.error(`Error getting all tags: ${err.message}`);
    return internalServerErrorRequest('Error getting tags.');
  }
};

exports.getTag = async tagId => {
  try {
    const [error, tag] = await TagRepository.getTag(tagId);
    if (tag) {
      return [
        HttpStatusCodes.OK,
        {
          message: 'Tags was successfully fetched.',
          tag
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error getting tag: ${err.message}`);
    return internalServerErrorRequest('Error getting tag.');
  }
};

exports.createTag = async payload => {
  try {
    const [error, tag] = await TagRepository.createTag(payload);
    if (tag) {
      return [
        HttpStatusCodes.CREATED,
        {
          message: 'Tags created with success.',
          tag
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.log(err);
    logger.error(`Error creating tag: ${err.message}`);
    return internalServerErrorRequest('Error creating tag.');
  }
};

exports.updateTag = async (tagId, payload) => {
  try {
    const [error, updatedTags] = await TagRepository.updateTag(tagId, payload);
    if (updatedTags) {
      return [
        HttpStatusCodes.OK,
        { message: 'Tags was successfully updated.', tag: updatedTags }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error updating tag: ${err.message}`);
    return internalServerErrorRequest('Error updating tag.');
  }
};

exports.deleteTag = async tagId => {
  try {
    const [error, tag] = await TagRepository.getTag(tagId);
    if (tag) {
      const [error, deletedTags] = await TagRepository.deleteTag(tagId);
      if (deletedTags) {
        return [HttpStatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(err);
    logger.error(`Error deleting tag by id: ${err.message}`);
    return internalServerErrorRequest('Error deleting tag by id.');
  }
};
