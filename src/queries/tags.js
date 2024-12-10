'use strict';

import logger from '../logger';
import models from '../models';

export const getTags = async query => {
  try {
    const { Tag } = models;
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
    const tags = await Tag.find(search, null, options).lean().exec();
    const total = await Tag.countDocuments(search);

    const result = tags.map(tag => ({
      ...tag,
      total,
      pages: Math.ceil(total / limit)
    }));

    if (result) {
      return [null, result];
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting tag data from db: ${err.message}`);
    return [new Error('Unable to find tags by search criteria.')];
  }
};

export const getTag = async tagId => {
  try {
    const { Tag } = models;
    const tag = await Tag.findOne({ tagId });
    return tag;
  } catch (err) {
    console.error(err);
    logger.error(
      `Error getting tag data from db by id: ${tagId}: ${err.message}`
    );
    return [new Error('Unable to find tag by id.')];
  }
};

export const getTagByName = async name => {
  try {
    const { Tag } = models;
    const tag = await Tag.findOne({ name });
    return tag;
  } catch (err) {
    console.error(err);
    logger.error(`Error getting tag data from db by name: ${err.message}`);
    return [new Error('Unable to find tag by name.')];
  }
};

export const createTag = async payload => {
  try {
    const { Tag } = models;
    const tag = await Tag.findOne({ name: payload.name });
    if (tag) {
      return [new Error('Tag with name already exists.')];
    }
    const r = new Tag(payload);
    const createdTag = await r.save();
    const { description, name, tagId } = createdTag;
    return [null, { description, name, tagId }];
  } catch (err) {
    console.error(err);
    logger.error(`Error saving tag data to db: ${err.message}`);
    return [new Error('Unable to update tag.')];
  }
};

export const updateTag = async (tagId, payload) => {
  try {
    const { Tag } = models;
    const filter = { tagId };
    const options = { new: true };
    const update = { ...payload };
    const tag = await Tag.findOneAndUpdate(filter, update, options);
    return [null, tag];
  } catch (err) {
    console.error(err);
    logger.error(`Error updating tag data to db: ${err.message}`);
    return [new Error('Unable to update tag.')];
  }
};

export const deleteTag = async tagId => {
  try {
    const { Tag } = models;
    const deletedTag = await Tag.deleteOne({ tagId });
    if (deletedTag.deletedCount > 0) {
      return [null, deletedTag];
    }
    return [new Error('Unable to find tag to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting tag by id ${tagId}: ${err.message}`);
    return [new Error('Unable to delete tag.')];
  }
};
