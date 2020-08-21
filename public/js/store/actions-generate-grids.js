import { createUUID } from '../util/utils.js';
import { sounds as soundNames } from '../util/constants.js'
import { getDrums } from './selectors.js';
import { createPattern as createGridsPattern } from '../grids/pattern-generator.js';

export function generateGridsScore(state, sampleData) {
  const drums = getDrums();
  const numPatterns = 4;
  const score = [0, 1, 2, 3];
  const tracks = {
    allIds: [],
    byId: {},
  };
  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  const randomness = 100;

  // create the tracks
  soundNames.forEach((soundName, trackIndex) => {
    if (drums[soundName]) {
      const sample = sampleData.find(sample => sample.sound === soundName);
      const sampleId = sample.id;
      const trackId = createUUID();

      tracks.allIds.push(trackId);
      tracks.byId[trackId] = {
        gain: 1,
        playbackDuration: 0.5,
        sampleId,
        sampleStartOffset: 0,  
        patterns: [],
      };
    }
  });

  // create the patterns within the tracks
  for (let i = 0; i < numPatterns; i++) {
    const xRandom = i < 3 ? x : Math.min(255, x + Math.floor(Math.random() * 10));
    const yRandom = i < 3 ? x : Math.min(255, y + Math.floor(Math.random() * 10));
    const density = 127;
    const gridsPattern = createGridsPattern(xRandom, yRandom, randomness, density);
    
    soundNames.forEach((soundName, trackIndex) => {
      if (drums[soundName]) {
        const pattern = gridsPattern.reduce((accumulator, step, index) => {
          if (step[trackIndex]) {
            return [ ...accumulator, { 
              time: index / 32, 
              velocity: step[trackIndex],
            }];
          }
          return accumulator;
        }, []);
        tracks.byId[tracks.allIds[trackIndex]].patterns.push(pattern);
      }
    });
  }

  return { score, tracks };
}
