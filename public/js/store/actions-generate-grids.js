import { createUUID } from '../util/utils.js';
import { sounds as soundNames } from '../util/constants.js'
import { getDrums } from './selectors.js';
import { createPattern as createGridsPattern } from '../grids/pattern-generator.js';

export function generateGridsScore(state, sampleData) {
  const score = [0];
  const tracks = {
    allIds: [],
    byId: {},
  };

  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  console.log('x', x, 'y', y);
  const gridsPattern = createGridsPattern(x, y);

  soundNames.forEach((soundName, trackIndex) => {
    const drums = getDrums();
    if (drums[soundName]) {
      const sample = sampleData.find(sample => sample.sound === soundName);
      const sampleId = sample.id;
      const pattern = gridsPattern.reduce((accumulator, step, index) => {
        if (step[trackIndex]) {
          return [ ...accumulator, { time: index / 32 }];
        }
        return accumulator;
      }, []);
      const trackId = createUUID();

      tracks.allIds.push(trackId);
      tracks.byId[trackId] = {
        gain: 1,
        playbackDuration: 0.5,
        sampleId,
        sampleStartOffset: 0,  
        patterns: [
          pattern,
        ],
      };
    }
  });

  return { score, tracks };
}
