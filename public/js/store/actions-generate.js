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
  const tracks = {
    allIds: [],
    byId: {},
  };

  for (let i = 0, n = numTracks; i < n; i++) {
    const trackId = createUUID();
    tracks.allIds.push(trackId);
    tracks.byId[trackId] = createTrack(state, sampleData, i);
  }

  return { tracks };
}

function createTrack(state, sampleData, index) {
  const { settings } = state;
  const { numSamples, loopDurationInSecs } = settings;
  const { duration, id: sampleId } = sampleData[Math.floor(Math.random() * numSamples)];
  let sampleDuration = 0.5;
  let gain = 1;
  let pattern = createPattern(index);

  if (duration >= loopDurationInSecs) {
    sampleDuration = duration;
    gain = 0.1;
    pattern = [{ time: 0 }];
  }

  const sampleStartOffset = duration > 3 ? Math.random() * (duration - sampleDuration) : 0;

  return {
    gain,
    sampleDuration,
    sampleId,
    sampleStartOffset,
    pattern: createPattern(index),
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