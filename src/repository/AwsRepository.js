'use strict';

import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import config from '../config';
import {
  DEFAULT_COVERIMAGE_FILE_EXTENTION,
  DEFAULT_SONG_FILE_EXTENTION,
  DEFAULT_THUMBNAIL_FILE_EXTENTION,
  DEFAULT_VIDEO_FILE_EXTENTION
} from '../constants';
import logger from '../logger';

const { aws } = config.sources;
const { region, signatureVersion, s3, cloudFront } = aws;
const {
  s3AccessKeyId,
  s3SecretAccessKey,
  s3VideoBucketName,
  s3ThumbnailBucketName,
  s3SongBucketName,
  s3CoverImageBucketName
} = s3;

const {
  videoDistributionURI,
  thumbnailDistributionURI,
  songDistributionURI,
  coverImageDistributionURI
} = cloudFront;

// Create S3 service object
const s3Client = new S3Client({
  region,
  signatureVersion,
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey
  }
});

/**
 * Video helper functions
 */
exports.getVideoObjectKey = key => {
  return `${key}.${DEFAULT_VIDEO_FILE_EXTENTION}`;
};

exports.getThumbnailObjectKey = key => {
  return `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`;
};

const getS3VideoParams = (key = '') => {
  const params = {
    Bucket: s3VideoBucketName
  };
  if (key) {
    params.Key = getVideoObjectKey(key);
  }
  return params;
};

const getS3ThumbnailParams = (key = '') => {
  const params = {
    Bucket: s3ThumbnailBucketName
  };
  if (key) {
    params.Key = getThumbnailObjectKey(key);
  }
  return params;
};

exports.getVideoDistributionURI = key => {
  return `${videoDistributionURI}/${getVideoObjectKey(key)}`;
};

exports.getThumbnailDistributionURI = key => {
  return `${thumbnailDistributionURI}/${getThumbnailObjectKey(key)}`;
};

exports.getIsVideoBucketAvailable = async () => {
  try {
    const command = new HeadBucketCommand({ Bucket: s3VideoBucketName });
    await s3Client.send(command);
    return true; // Bucket exists and is accessible
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'getIsVideoBucketAvailable',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.getIsThumbnailBucketAvailable = async () => {
  try {
    const command = new HeadBucketCommand({ Bucket: s3ThumbnailBucketName });
    await s3Client.send(command);
    return true; // Bucket exists and is accessible
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'getIsThumbnailBucketAvailable',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.createVideoBucket = async () => {
  try {
    const command = new CreateBucketCommand({ Bucket: s3VideoBucketName });
    await s3Client.send(command);
    return `Bucket "${s3VideoBucketName}" has been created successfully.`;
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'createVideoBucket',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.createThumbnailBucket = async () => {
  try {
    const command = new CreateBucketCommand({ Bucket: s3ThumbnailBucketName });
    await s3Client.send(command);
    return `Bucket "${s3ThumbnailBucketName}" has been created successfully.`;
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'createThumbnailBucket',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.getIsVideoObjectAvailable = async key => {
  try {
    const params = {
      Bucket: s3VideoBucketName,
      Key: key
    };
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true; // Object exists
  } catch (error) {
    if (error.name === 'NotFound') {
      return false; // Object does not exist
    } else {
      const { requestId, cfId, extendedRequestId } = error.$metadata;
      logger.error({
        message: 'getIsVideoObjectAvailable',
        requestId,
        cfId,
        extendedRequestId
      });
      return false; // Object does not exist
    }
  }
};

exports.getIsThumbnailObjectAvailable = async key => {
  try {
    const params = {
      Bucket: s3ThumbnailBucketName,
      Key: key
    };
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true; // Object exists
  } catch (error) {
    if (error.name === 'NotFound') {
      return false; // Object does not exist
    } else {
      const { requestId, cfId, extendedRequestId } = error.$metadata;
      logger.error({
        message: 'getIsThumbnailObjectAvailable',
        requestId,
        cfId,
        extendedRequestId
      });
      return false; // Object does not exist
    }
  }
};

exports.copyVideoObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        ...getS3VideoParams(newKey),
        CopySource: `${s3VideoBucketName}/${getVideoObjectKey(oldKey)}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyVideoObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

exports.copyThumbnailObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        ...getS3CoverImageParams(newKey),
        CopySource: `${s3ThumbnailBucketName}/${getThumbnailObjectKey(oldKey)}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyThumbnailObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

exports.deleteVideoByKey = key => {
  return new Promise((resolve, reject) => {
    try {
      s3Client.send(new DeleteObjectCommand(getS3VideoParams(key)));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteVideoByKey',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

exports.deleteThumbnailByKey = key => {
  return new Promise((resolve, reject) => {
    try {
      s3Client.send(new DeleteObjectCommand(getS3ThumbnailParams(key)));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteThumbnailByKey',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

/**
 * Song helper functions
 */
exports.getSongObjectKey = key => {
  return `${key}.${DEFAULT_SONG_FILE_EXTENTION}`;
};

exports.getCoverImageObjectKey = key => {
  return `${key}.${DEFAULT_COVERIMAGE_FILE_EXTENTION}`;
};

const getS3SongParams = (key = '') => {
  const params = {
    Bucket: s3SongBucketName
  };
  if (key) {
    params.Key = getSongObjectKey(key);
  }
  return params;
};

const getS3CoverImageParams = (key = '') => {
  const params = {
    Bucket: s3CoverImageBucketName
  };
  if (key) {
    params.Key = getCoverImageObjectKey(key);
  }
  return params;
};

exports.getSongDistributionURI = key => {
  return `${songDistributionURI}/${getSongObjectKey(key)}`;
};

exports.getCoverImageDistributionURI = key => {
  return `${coverImageDistributionURI}/${getCoverImageObjectKey(key)}`;
};

exports.getIsSongBucketAvailable = async () => {
  try {
    const command = new HeadBucketCommand({ Bucket: s3SongBucketName });
    await s3Client.send(command);
    return true; // Bucket exists and is accessible
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'getIsSongBucketAvailable',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.getIsCoverImageBucketAvailable = async () => {
  try {
    const command = new HeadBucketCommand({ Bucket: s3CoverImageBucketName });
    await s3Client.send(command);
    return true; // Bucket exists and is accessible
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'getIsCoverImageBucketAvailable',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.getIsSongObjectAvailable = async key => {
  try {
    const params = {
      Bucket: s3SongBucketName,
      Key: key
    };
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true; // Object exists
  } catch (error) {
    if (error.name === 'NotFound') {
      return false; // Object does not exist
    } else {
      const { requestId, cfId, extendedRequestId } = error.$metadata;
      logger.error({
        message: 'getIsSongObjectAvailable',
        requestId,
        cfId,
        extendedRequestId
      });
      return false; // Object does not exist
    }
  }
};

exports.getIsCoverImageObjectAvailable = async key => {
  try {
    const params = {
      Bucket: s3CoverImageBucketName,
      Key: key
    };
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true; // Object exists
  } catch (error) {
    if (error.name === 'NotFound') {
      return false; // Object does not exist
    } else {
      const { requestId, cfId, extendedRequestId } = error.$metadata;
      logger.error({
        message: 'getIsCoverImageObjectAvailable',
        requestId,
        cfId,
        extendedRequestId
      });
      return false; // Object does not exist
    }
  }
};

exports.createSongBucket = async () => {
  try {
    const command = new CreateBucketCommand({ Bucket: s3SongBucketName });
    await s3Client.send(command);
    return `Bucket "${s3SongBucketName}" has been created successfully.`;
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'createSongBucket',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.createCoverImageBucket = async () => {
  try {
    const command = new CreateBucketCommand({ Bucket: s3CoverImageBucketName });
    await s3Client.send(command);
    return `Bucket "${s3CoverImageBucketName}" has been created successfully.`;
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error({
      message: 'createCoverImageBucket',
      requestId,
      cfId,
      extendedRequestId
    });
    return false;
  }
};

exports.copySongObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        ...getS3SongParams(newKey),
        CopySource: `${s3SongBucketName}/${getSongObjectKey(oldKey)}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copySongObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

exports.copyCoverImageObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        ...getS3CoverImageParams(newKey),
        CopySource: `${s3CoverImageBucketName}/${getCoverImageObjectKey(
          oldKey
        )}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyCoverImageObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

exports.deleteSongByKey = key => {
  return new Promise((resolve, reject) => {
    try {
      s3Client.send(new DeleteObjectCommand(getS3SongParams(key)));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteSongByKey',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

exports.deleteCoverImageByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      await s3Client.send(new DeleteObjectCommand(getS3CoverImageParams(key)));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteCoverImageByKey',
        requestId,
        cfId,
        key,
        extendedRequestId
      });
      reject(err);
    }
  });
};
