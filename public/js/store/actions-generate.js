import { createUUID } from '../system/utils.js';
import patterns from './actions-patterns.js';

/**
 * Generate score.
 * @param {Object} state 
 * @returns {Object} score 
 * @returns {Array} sampleData 
 */
export function generateScore(state, sampleData) {
  const { settings } = state;
  const { numSamples, numTracks } = settings;
  const score = [0, 0, 1, 1];
  const tracks = {
    allIds: [],
    byId: {},
  };

  for (let i = 0, n = numTracks; i < n; i++) {
    const trackId = createUUID();
    tracks.allIds.push(trackId);
    tracks.byId[trackId] = createTrack(state, sampleData, i);
  }

  return { score, tracks };
}

function createTrack(state, sampleData, trackIndex) {
  const { settings } = state;
  const { numSamples, loopDurationInSecs } = settings;
  const { duration, id: sampleId } = sampleData[Math.floor(Math.random() * numSamples)];
  let playbackDuration = 0.5;
  let gain = 1;
  let pattern = createPattern(trackIndex);

  if (duration >= loopDurationInSecs) {
    playbackDuration = loopDurationInSecs;
    gain = 0.1;
    pattern = [{ time: 0 }];
  }

  const sampleStartOffset = duration > 3 ? Math.random() * (duration - playbackDuration) : 0;

  return {
    gain,
    playbackDuration,
    sampleId,
    sampleStartOffset,
    patterns: [
      createPattern(trackIndex),
      createPattern(trackIndex),
    ],
  };
}

function createPattern(trackIndex) {
  switch (trackIndex) {
    // case 0:
    //   return patterns.fourfour;

    case 1: {
      const pattern = [];
      pattern.push({ time: Math.floor(Math.random() * 16) / 16 });
      pattern.push({ time: Math.floor(Math.random() * 16) / 16 });
      pattern.push({ time: Math.floor(Math.random() * 16) / 16 });
      return pattern;
    }

    default: {

      const pattern = [];
      pattern.push({ time: Math.floor(Math.random() * 16) / 16 });
      return pattern;
    }
  }
}