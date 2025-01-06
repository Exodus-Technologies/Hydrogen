'use strict';

import logger from '../logger';
import { AuthService } from '../services';

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');
    const [statusCode, response] = await AuthService.validateLogin(
      email,
      password,
      ipAddress,
      userAgent
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with login: ${err.message}`);
    next(err);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [statusCode, response] = await AuthService.requestPasswordReset(
      email
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error password reset requesting for user: ${email}: ${err.message}`
    );
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;
    const [statusCode, response] = await AuthService.verifyOTP(email, otpCode);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error verifying otp code for user: ${email}: ${err.message}`);
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;
    const [statusCode, response] = await AuthService.changePassword(
      email,
      token,
      password
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with changing password: ${err.message}`);
    next(err);
  }
};
