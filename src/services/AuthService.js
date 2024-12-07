'use strict';

import logger from '../logger';
import {
  createOTPCode,
  deleteCode,
  getCodeByUserId,
  verifyOTPCode
} from '../queries/code';
import { getUserByEmail, updateLastLogin } from '../queries/users';
import {
  HttpStatusCodes,
  badRequest,
  internalServerErrorRequest
} from '../response-codes';
import {
  generateAuthorizationToken,
  generateOTPCode,
  verifyJWTToken
} from '../utilities/token';

exports.validateLogin = async (email, password) => {
  try {
    const [error, user] = await getUserByEmail(email);
    if (user) {
      const validPassword = user.getIsValidPassword(password);
      if (validPassword) {
        const [err, updatedUser] = await updateLastLogin(user.userId);
        const token = generateAuthorizationToken(user);
        return [
          HttpStatusCodes.OK,
          {
            message: 'Successful login',
            user: updatedUser,
            token
          }
        ];
      }
      return badRequest('Username and password combination was incorrect.');
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error(`Error logging with credentials: `, err);
    return internalServerErrorRequest('Error logging with credentials.');
  }
};

exports.requestPasswordReset = async email => {
  try {
    const [error, user] = await getUserByEmail(email);
    if (error || !user) {
      return badRequest(error.message);
    }

    const { userId } = user;

    const [_, existingCode] = await getCodeByUserId(userId);

    if (existingCode) {
      deleteCode(userId);
    }

    const [err, otpCode] = generateOTPCode();

    await createOTPCode({ userId, email, otpCode });

    return [
      HttpStatusCodes.OK,
      {
        message: `Password reset success! An email with instructions has been sent.`
      }
    ];
  } catch (err) {
    logger.error(`Error password reset requesting: ${err.message}`);
    return internalServerErrorRequest('Error password reset requesting.');
  }
};

exports.verifyOTP = async (email, otpCode) => {
  try {
    const [error, isVerified] = await verifyOTPCode(email, otpCode);
    if (isVerified) {
      const [_, user] = await getUserByEmail(email);
      if (user) {
        const token = generateAuthorizationToken(user);
        return [
          HttpStatusCodes.OK,
          { message: 'Code was verified successfully.', token }
        ];
      }
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error verifing code: ', err);
    return internalServerErrorRequest('Error verifing code.');
  }
};

exports.changePassword = async (email, token, newPassword) => {
  try {
    const [error, user] = await getUserByEmail(email);

    if (error || !user) {
      return badRequest(error.message);
    }

    const isVerified = verifyJWTToken(token);
    if (isVerified) {
      user.password = newPassword;
      const updatedUser = await user.save();
      if (updatedUser) {
        const { userId } = updatedUser;
        deleteCode(userId);
        return [
          HttpStatusCodes.OK,
          {
            message: 'Password reset successful.'
          }
        ];
      }
    }
    return badRequest('Token provided does not match.');
  } catch (err) {
    logger.error(`Error updating password: ${err.message}`);
    return internalServerErrorRequest('Error updating password.');
  }
};
