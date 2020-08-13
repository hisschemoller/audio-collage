import { createUUID } from '../system/utils.js';
import { createPattern as createGridsPattern } from '../grids/pattern-generator.js';

export function generateGridsScore(state, sampleData) {
  const { settings } = state;
  const { numSamples, numTracks } = settings;
  const score = [0];
  const tracks = {
    allIds: [],
    byId: {},
  };
  const gridsPattern = createGridsPattern();

  for (let i = 0, n = numTracks; i < n; i++) {
    const trackId = createUUID();
    tracks.allIds.push(trackId);
    tracks.byId[trackId] = createTrack(state, sampleData, i, gridsPattern);
  }

  return { score, tracks };
}

function createTrack(state, sampleData, trackIndex, gridsPattern) {
  const { settings } = state;
  const { numSamples } = settings;
  const { id: sampleId } = sampleData[Math.floor(Math.random() * numSamples)];
  const pattern = gridsPattern.reduce((accumulator, step, index) => {
    if (step[trackIndex]) {
      return [ ...accumulator, { time: index / 32 }];
    }
    return accumulator;
  }, []);

  return {
    gain: 1,
    playbackDuration: 0.2,
    sampleId,
    sampleStartOffset: 0,  
    patterns: [
      pattern,
    ],
  };
}
