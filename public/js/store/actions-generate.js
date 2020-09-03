import { createUUID } from '../util/utils.js';
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
  const score = [0, 0, 0, 0, 1, 1, 1, 1];
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

/**
 *
 *
 * @param {*} state
 * @param {*} sampleData
 * @param {*} trackIndex
 * @returns
 */
function createTrack(state, sampleData, trackIndex) {
  const { settings } = state;
  const { numSamples, loopDurationInSecs } = settings;
  const { duration: sampleDuration, id: sampleId } = sampleData[Math.floor(Math.random() * numSamples)];
  const isLongSample = sampleDuration >= loopDurationInSecs
  const playbackDuration = isLongSample ? loopDurationInSecs : 0.5;
  const gain = isLongSample ? 0.5 : 1;
  const sampleStartOffset = isLongSample ? Math.random() * (sampleDuration - playbackDuration) : 0;

  const numPatterns = 2;
  const patterns = [];
  for (let i = 0; i < numPatterns; i++) {
    if (isLongSample) {
      patterns.push([{ time: 0, velocity: 60 }]);
    } else {
      patterns.push(createPattern(trackIndex));
    }
  }

  return {
    gain,
    pan: 0,
    playbackDuration,
    reverbSendGain: 0,
    sampleId,
    sampleStartOffset,  
    patterns,
  };
}

/**
 *
 *
 * @param {*} trackIndex
 * @returns
 */
function createPattern(trackIndex) {
  switch (trackIndex) {

    // case 0:
    //   return patterns.fourfour;

    case 1: {

      // 1 to 3 notes
      const pattern = [];
      const numNotes = Math.ceil(Math.random() * 3);
      for (let i = 0; i < numNotes; i++) {
        const time = Math.floor(Math.random() * 16) / 16;
        if (!pattern.find(note => note.time === time)) {
          pattern.push({ time, velocity: 100, });
        }
      }
      return pattern;
    }

    default: {

      // 1 note
      const pattern = [];
      pattern.push({ 
        time: Math.floor(Math.random() * 16) / 16,
        velocity: 100,
      });
      return pattern;
    }
  }
}
