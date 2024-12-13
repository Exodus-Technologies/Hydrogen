'use strict';

import { configDotenv } from 'dotenv';
import { convertArgToBoolean } from '../utilities/boolean';

configDotenv();

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME,
  FRONT_END_APP_ORIGIN_URL: process.env.FRONT_END_APP_ORIGIN_URL,
  RATE_LIMIT_MS: +process.env.RATE_LIMIT_MS,
  RATE_LIMIT_MAX: +process.env.RATE_LIMIT_MAX,
  TRUST_PROXY: convertArgToBoolean(process.env.TRUST_PROXY),
  auth: {
    HASH_SALT: +process.env.HASH_SALT,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_EXPIRY: +process.env.TOKEN_EXPIRY
  },
  sources: {
    aws: {
      region: process.env.AWS_REGION,
      signatureVersion: process.env.AWS_SIGNATURE_VERSION,
      cloudFront: {
        videoDistributionURI:
          process.env.AWS_CLOUDFRONT_VIDEOS_DISTRIBUTION_URI,
        thumbnailDistributionURI:
          process.env.AWS_CLOUDFRONT_THUMBNAILS_DISTRIBUTION_URI,
        songDistributionURI: process.env.AWS_CLOUDFRONT_SONGS_DISTRIBUTION_URI,
        coverImageDistributionURI:
          process.env.AWS_CLOUDFRONT_COVERIMAGES_DISTRIBUTION_URI
      },
      s3: {
        s3AccessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
        s3SecretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY,
        s3ThumbnailBucketName: process.env.S3_THUMBNAIL_BUCKET_NAME,
        s3VideoBucketName: process.env.S3_VIDEO_BUCKET_NAME,
        s3SongBucketName: process.env.S3_SONG_BUCKET_NAME,
        s3CoverImageBucketName: process.env.S3_COVERIMAGE_BUCKET_NAME
      }
    },
    database: {
      CLUSTER_DOMAIN: process.env.CLUSTER_DOMAIN,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_PASS: process.env.DB_PASS,
      DB_APP_NAME: process.env.DB_APP_NAME,
      EXPIRY_TIME: +process.env.EXPIRY_TIME,
      options: {}
    }
  }
};

export default config;
