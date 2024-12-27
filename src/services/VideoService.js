'use strict';

import {
  copyThumbnailObject,
  copyVideoObject,
  deleteThumbnailByKey,
  deleteVideoByKey,
  getThumbnailDistributionURI,
  getVideoDistributionURI
} from '../aws';
import logger from '../logger';
import { VideoRepository } from '../repository';
import {
  badRequest,
  HttpStatusCodes,
  internalServerErrorRequest
} from '../response-codes';

exports.getVideos = async query => {
  try {
    const [error, videos] = await VideoRepository.getVideos(query);
    if (videos) {
      return [
        HttpStatusCodes.OK,
        { message: 'Videos fetched from db with success', videos }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting all videos: ${err.message}`);
    return internalServerErrorRequest('Error getting videos.');
  }
};

exports.getVideo = async videoId => {
  try {
    const [error, video] = await VideoRepository.getVideo(videoId);
    if (video) {
      return [
        HttpStatusCodes.OK,
        { message: 'Video fetched from db with success', video }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error getting video by id ${videoId}: ${err.message}`);
    return internalServerErrorRequest('Error getting video by id.');
  }
};

exports.uploadVideo = async archive => {
  try {
    const {
      title,
      description,
      url,
      videoKey,
      thumbnail,
      thumbnailKey,
      tags,
      duration
    } = archive;

    const [error, video] = await VideoRepository.getVideoByTitle(title);

    if (error) {
      return badRequest(error.message);
    } else if (video) {
      return badRequest(`Please provide another title for the video.`);
    } else {
      const body = {
        title,
        description,
        videoKey,
        ...(tags && {
          tags: tags.split(',').map(item => item.trim())
        }),
        url: getVideoDistributionURI(videoKey) || url,
        thumbnailKey,
        duration,
        thumbnail: getThumbnailDistributionURI(thumbnailKey) || thumbnail
      };

      const [error, video] = await VideoRepository.createVideo(body);
      if (video) {
        return [
          HttpStatusCodes.CREATED,
          { message: 'Video uploaded to s3 with success', video }
        ];
      } else {
        return badRequest(error.message);
      }
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error uploading video to s3: ${err.message}`);
    return internalServerErrorRequest('Error uploading video to s3.');
  }
};

exports.updateVideo = async payload => {
  try {
    const {
      title,
      description,
      url,
      videoKey,
      thumbnail,
      thumbnailKey,
      tags,
      videoId,
      duration
    } = payload;

    const [error, video] = await VideoRepository.getVideo(videoId);

    if (error) {
      return badRequest(error.message);
    } else if (video) {
      if (videoKey !== video.videoKey) {
        await copyVideoObject(video.videoKey, videoKey);
      }
      if (thumbnailKey !== video.thumbnailKey) {
        await copyThumbnailObject(video.thumbnailKey, thumbnailKey);
      }

      const body = {
        title,
        videoId,
        description,
        videoKey,
        ...(tags && {
          tags: tags.split(',').map(item => item.trim())
        }),
        url: getVideoDistributionURI(videoKey) || url,
        thumbnailKey,
        duration,
        thumbnail: getThumbnailDistributionURI(thumbnailKey) || thumbnail
      };
      const [error, updatedVideo] = await VideoRepository.updateVideo(body);
      if (error) {
        return badRequest(error.message);
      }
      deleteVideoByKey(video.videoKey);
      deleteThumbnailByKey(video.thumbnailKey);
      return [
        HttpStatusCodes.OK,
        {
          message: 'Video updated to s3 with success',
          video: updatedVideo
        }
      ];
    } else {
      return badRequest(`No video was found to update by videoId provided.`);
    }
  } catch (err) {
    console.error(err);
    logger.error(`Error updating video metadata: ${err.message}`);
    return internalServerErrorRequest('Error updating video metadata.');
  }
};

exports.updateViews = async videoId => {
  try {
    const [error, video] = await VideoRepository.updateVideoViews(videoId);
    if (video) {
      const { views, title } = video;
      return [
        HttpStatusCodes.OK,
        {
          message: `Video with title '${title.trim()}' has ${views} views.`,
          views
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.error(err);
    logger.error(`Error updating video metadata for views: ${err.message}`);
    return internalServerErrorRequest(
      'Error updating video metadata for views.'
    );
  }
};

exports.deleteVideo = async videoId => {
  try {
    const [error, video] = await VideoRepository.getVideo(videoId);
    if (error) {
      return badRequest(error.message);
    }
    if (video) {
      const { videoKey, thumbnailKey } = video;
      deleteVideoByKey(videoKey);
      deleteThumbnailByKey(thumbnailKey);
      const [error, deletedVideo] = await VideoRepository.deleteVideo(videoId);
      if (deletedVideo) {
        return [HttpStatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(`No video found with id provided.`);
  } catch (err) {
    console.error(err);
    logger.error(`Error deleting video by id ${videoId}: ${err.message} `);
    return internalServerErrorRequest('Error deleting video by id.');
  }
};
