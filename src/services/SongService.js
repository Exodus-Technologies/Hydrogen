'use strict';

import {
  copySongObject,
  copyThumbnailObject,
  deleteSongByKey,
  deleteThumbnailByKey,
  getSongDistributionURI,
  getThumbnailDistributionURI
} from '../aws';
import logger from '../logger';
import { SongRepository } from '../repository';
import {
  badRequest,
  HttpStatusCodes,
  internalServerErrorRequest
} from '../response-codes';

exports.getSongs = async query => {
  try {
    const [error, songs] = await SongRepository.getSongs(query);
    if (songs) {
      return [
        HttpStatusCodes.OK,
        { message: 'Songs fetched from db with success', songs }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error(`Error getting all songs: ${err.message}`);
    return internalServerErrorRequest('Error getting songs.');
  }
};

exports.getSong = async songId => {
  try {
    const [error, song] = await SongRepository.getSong(songId);
    if (error) {
      return badRequest(error.message);
    }
    if (song) {
      return [
        HttpStatusCodes.OK,
        { message: 'Song fetched from db with success', song }
      ];
    }
  } catch (err) {
    logger.error(`Error getting song by id ${songId}: ${err.message}`);
    return internalServerErrorRequest('Error getting song by id.');
  }
};

exports.uploadSong = async archive => {
  try {
    const {
      title,
      description,
      url,
      songKey,
      thumbnail,
      thumbnailKey,
      tags,
      duration
    } = archive;

    const [error, song] = await SongRepository.getSongByTitle(title);

    if (error) {
      return badRequest(error.message);
    } else if (song) {
      return badRequest(`Please provide another title for the song.`);
    } else {
      const body = {
        title,
        description,
        songKey,
        ...(tags && {
          tags: tags.split(',').map(item => item.trim())
        }),
        url: getSongDistributionURI(songKey) || url,
        thumbnailKey,
        duration,
        thumbnail: getThumbnailDistributionURI(thumbnailKey) || thumbnail
      };

      const song = await SongRepository.createSong(body);
      if (song) {
        return [
          HttpStatusCodes.CREATED,
          { message: 'Song uploaded to s3 with success', song }
        ];
      } else {
        return badRequest('Unable to save song with metadata.');
      }
    }
  } catch (err) {
    logger.error(`Error uploading song to s3: `, err);
    return internalServerErrorRequest('Error uploading song to s3.');
  }
};

exports.updateSong = async payload => {
  try {
    const {
      title,
      description,
      url,
      songKey,
      thumbnail,
      thumbnailKey,
      tags,
      songId,
      duration
    } = payload;

    const [error, song] = await SongRepository.getSong(songId);

    if (error) {
      return badRequest(error.message);
    }

    if (song) {
      if (songKey !== song.songKey) {
        await copySongObject(song.songKey, songKey);
      }
      if (thumbnailKey !== song.thumbnailKey) {
        await copyThumbnailObject(song.thumbnailKey, thumbnailKey);
      }

      const body = {
        title,
        songId,
        description,
        songKey,
        ...(tags && {
          tags: tags.split(',').map(item => item.trim())
        }),
        url: getSongDistributionURI(songKey) || url,
        thumbnailKey,
        duration,
        thumbnail: getThumbnailDistributionURI(thumbnailKey) || thumbnail
      };
      await SongRepository.updateSong(body);
      deleteSongByKey(song.songKey);
      deleteThumbnailByKey(song.thumbnailKey);
      return [
        HttpStatusCodes.OK,
        {
          message: 'Song updated to s3 with success',
          song: {
            ...body
          }
        }
      ];
    } else {
      return badRequest(`No song was found to update by songId provided.`);
    }
  } catch (err) {
    logger.error(`Error updating song metadata: `, err);
    return internalServerErrorRequest('Error updating song metadata.');
  }
};

exports.updateListens = async songId => {
  try {
    const [error, song] = await SongRepository.updateSongListens(songId);
    if (error) {
      return badRequest(error.message);
    }
    if (song) {
      const { listens, title } = song;
      return [
        HttpStatusCodes.OK,
        {
          message: `Song with title '${title.trim()}' has ${listens} listens.`,
          views
        }
      ];
    }
    return badRequest(`No songs found to update listens.`);
  } catch (err) {
    logger.error('Error updating listens on song: ', err);
    return internalServerErrorRequest('Error updating views.');
  }
};

exports.deleteSong = async songId => {
  try {
    const [error, song] = await SongRepository.getSong(songId);
    if (error) {
      return badRequest(error.message);
    }
    if (song) {
      const { songKey, thumbnailKey } = song;
      deleteSongByKey(songKey);
      deleteThumbnailByKey(thumbnailKey);
      const [error, deletedSong] = await SongRepository.deleteSong(songId);
      if (deletedSong) {
        return [HttpStatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(`No song found with id provided.`);
  } catch (err) {
    logger.error('Error deleting song by id: ', err);
    return internalServerErrorRequest('Error deleting song by id.');
  }
};
