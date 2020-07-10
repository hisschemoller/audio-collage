import { createUUID } from '../system/utils.js';

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
      pattern: [
        {
          time: 0/16,
        },
        {
          time: 4/16,
        },
        {
          time: 8/16,
        },
        {
          time: 12/16,
        },
      ],
    };
  }

  return { tracks };
}