'use strict';

import logger from '../logger';
import { AwsRepository, SongRepository } from '../repository';
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
      coverImage,
      coverImageKey,
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
        url: AwsRepository.getSongDistributionURI(songKey) || url,
        coverImageKey,
        duration,
        coverImage:
          AwsRepository.getCoverImageDistributionURI(coverImageKey) ||
          coverImage
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
      coverImage,
      coverImageKey,
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
        const isSongBucketAvaiable =
          await AwsRepository.getIsSongBucketAvailable();
        if (!isSongBucketAvaiable) {
          await AwsRepository.createSongBucket();
        }
        await AwsRepository.copySongObject(song.songKey, songKey);
      }
      if (coverImageKey !== song.coverImageKey) {
        const isCoverImageBucketAvailable =
          await AwsRepository.getIsCoverImageBucketAvailable();
        if (!isCoverImageBucketAvailable) {
          await AwsRepository.createCoverImageBucket();
        }
        await AwsRepository.copyCoverImageObject(
          song.coverImageKey,
          coverImageKey
        );
      }

      const body = {
        title,
        songId,
        description,
        songKey,
        ...(tags && {
          tags: tags.split(',').map(item => item.trim())
        }),
        url: AwsRepository.getSongDistributionURI(songKey) || url,
        coverImageKey,
        duration,
        coverImage:
          AwsRepository.getCoverImageDistributionURI(coverImageKey) ||
          coverImage
      };
      await SongRepository.updateSong(body);
      const isSongObjectAvaiable = await AwsRepository.getIsSongObjectAvailable(
        song.songKey
      );
      if (isSongObjectAvaiable) {
        AwsRepository.deleteVideoByKey(song.songKey);
      }
      const isCoverImageObjectAvailable =
        await AwsRepository.getIsCoverImageObjectAvailable(song.coverImageKey);
      if (isCoverImageObjectAvailable) {
        AwsRepository.deleteCoverImageByKey(song.coverImageKey);
      }
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
      const { songKey, coverImageKey } = song;
      const isSongObjectAvaiable = await AwsRepository.getIsSongObjectAvailable(
        songKey
      );
      if (isSongObjectAvaiable) {
        AwsRepository.deleteVideoByKey(songKey);
      }
      const isCoverImageObjectAvailable =
        await AwsRepository.getIsCoverImageObjectAvailable();
      if (isCoverImageObjectAvailable) {
        AwsRepository.deleteCoverImageByKey(coverImageKey);
      }
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
