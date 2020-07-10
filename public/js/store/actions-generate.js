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
    tracks.byId[trackId] = {
      sampleId: sampleData[Math.floor(Math.random() * numSamples)].id,
      pattern: getPattern(i),
    };
  }

  return { tracks };
}

function getPattern(trackIndex) {
  switch (trackIndex) {
    case 0:
      return patterns.fourfour;

    case 1: {
      const pattern = [];
      pattern.push({ time: Math.floor(Math.random() * 16) / 16 });
      pattern.push({ time: Math.floor(Math.random() * 16) / 16 });
      pattern.push({ time: Math.floor(Math.random() * 16) / 16 });
      return pattern;
    }

    case 2: {
      const pattern = [];
      pattern.push({ time: Math.floor(Math.random() * 16) / 16 });
      return pattern;
    }
  }
}