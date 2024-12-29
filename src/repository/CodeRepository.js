'use strict';

import logger from '../logger';
import models from '../models';

exports.getCode = async userId => {
  try {
    const { Code } = models;
    const code = await Code.findOne({ userId });
    if (code) {
      return [null, code];
    }
    return [new Error('Unable to find code associated with user.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error getting otpCode for user data to db: ${err.message}`);
    return [new Error('Unable to find code associated with user.')];
  }
};

exports.verifyOTPCode = async (email, otpCode) => {
  try {
    const { Code } = models;
    const code = await Code.findOne({ email });
    if (code.otpCode === otpCode) {
      return [null, true];
    }
    return [new Error('Unable to find code to verify.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error verifying otpCode: ${otpCode}: `, err);
    return [new Error('Unable to verify code')];
  }
};

exports.createOTPCode = async payload => {
  try {
    const { Code } = models;
    const { userId } = payload;
    const existingCode = await Code.findOne({ userId });
    if (!existingCode) {
      const newCode = new Code(payload);
      const createdCode = await newCode.save();
      return [null, createdCode];
    }
    return [new Error('Code with the userId provided exists and active.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error creating code data to db: ${err.message}`);
    return [new Error('Unable to create code to db.')];
  }
};

exports.deleteCode = async userId => {
  try {
    const { Code } = models;
    const deletedCode = await Code.deleteOne({ userId });
    if (deletedCode.deletedCount > 0) {
      return [null, deletedCode];
    }
    return [new Error('Unable to find code to delete details.')];
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting code data from db: ${err.message}`);
    return [new Error('Unable to find code to delete details.')];
  }
};
