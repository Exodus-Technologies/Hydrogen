'use strict';

import {
  CopyObjectCommand,
  DeleteObjectCommand,
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
export const getVideoObjectKey = key => {
  const extension = filename.split('.').pop();
  const timestamp = Date.now();
  `${timestamp}-${uuidv4()}.${extension}`;
  return `${key}.${DEFAULT_VIDEO_FILE_EXTENTION}`;
};

export const getThumbnailObjectKey = key => {
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

export const getVideoDistributionURI = key => {
  return `${videoDistributionURI}/${getVideoObjectKey(key)}`;
};

export const getThumbnailDistributionURI = key => {
  return `${thumbnailDistributionURI}/${getThumbnailObjectKey(key)}`;
};

export const copyVideoObject = (oldKey, newKey) => {
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

export const copyThumbnailObject = (oldKey, newKey) => {
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

export const deleteVideoByKey = key => {
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

export const deleteThumbnailByKey = key => {
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
export const getSongObjectKey = key => {
  return `${key}.${DEFAULT_SONG_FILE_EXTENTION}`;
};

export const getCoverImageObjectKey = key => {
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

export const getSongDistributionURI = key => {
  return `${songDistributionURI}/${getSongObjectKey(key)}`;
};

export const getCoverImageDistributionURI = key => {
  return `${coverImageDistributionURI}/${getCoverImageObjectKey(key)}`;
};

export const copySongObject = (oldKey, newKey) => {
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

export const copyCoverImageObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        ...getS3CoverImageParams(newKey),
        CopySource: `${s3IssueBucketName}/${getCoverImageObjectKey(oldKey)}`
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

export const deleteSongByKey = key => {
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

export const deleteCoverImageByKey = key => {
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
