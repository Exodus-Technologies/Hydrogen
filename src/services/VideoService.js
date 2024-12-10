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
import {
  createVideo,
  deleteVideo,
  getVideo,
  getVideoByTitle,
  getVideos,
  updateVideo,
  updateVideoViews
} from '../queries/videos.js';
import {
  badRequest,
  HttpStatusCodes,
  internalServerErrorRequest
} from '../response-codes';

exports.getVideos = async query => {
  try {
    const videos = await getVideos(query);
    if (videos) {
      return [
        HttpStatusCodes.OK,
        { message: 'Videos fetched from db with success', videos }
      ];
    } else {
      return badRequest(`No videos found with selected query params.`);
    }
  } catch (err) {
    logger.error('Error getting all videos: ', err);
    return internalServerErrorRequest('Error getting videos.');
  }
};

exports.getVideo = async videoId => {
  try {
    const video = await getVideo(videoId);
    if (video) {
      return [
        HttpStatusCodes.OK,
        { message: 'Video fetched from db with success', video }
      ];
    } else {
      return badRequest(`No video found with id provided.`);
    }
  } catch (err) {
    logger.error('Error getting video by id ', err);
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

    const video = await getVideoByTitle(title);

    if (video) {
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

      const video = await createVideo(body);
      if (video) {
        return [
          HttpStatusCodes.CREATED,
          { message: 'Video uploaded to s3 with success', video }
        ];
      } else {
        return badRequest('Unable to save video with metadata.');
      }
    }
  } catch (err) {
    logger.error(`Error uploading video to s3: `, err);
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

    const video = await getVideo(videoId);

    if (video) {
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
      await updateVideo(body);
      deleteVideoByKey(video.videoKey);
      deleteThumbnailByKey(video.thumbnailKey);
      return [
        HttpStatusCodes.OK,
        {
          message: 'Video updated to s3 with success',
          video: {
            ...body
          }
        }
      ];
    } else {
      return badRequest(`No video was found to update by videoId provided.`);
    }
  } catch (err) {
    logger.error(`Error updating video metadata: `, err);
    return internalServerErrorRequest('Error updating video metadata.');
  }
};

exports.updateViews = async videoId => {
  try {
    const video = await updateVideoViews(videoId);
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
    return badRequest(`No videos found to update clicks.`);
  } catch (err) {
    logger.error('Error updating views on video: ', err);
    return internalServerErrorRequest('Error updating views.');
  }
};

exports.deleteVideo = async videoId => {
  try {
    const video = await getVideo(videoId);
    if (video) {
      const { videoKey, thumbnailKey } = video;
      deleteVideoByKey(videoKey);
      deleteThumbnailByKey(thumbnailKey);
      const [error, deletedVideo] = await deleteVideo(videoId);
      if (deletedVideo) {
        return [HttpStatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(`No video found with id provided.`);
  } catch (err) {
    logger.error('Error deleting video by id: ', err);
    return internalServerErrorRequest('Error deleting video by id.');
  }
};
