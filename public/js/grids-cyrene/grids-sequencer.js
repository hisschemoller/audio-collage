import drumMap from './grids-patterns.js';

const MAX_PATTERN_LENGTH = 32;
const NUM_PATTERNS = 50;
const NUM_TRACKS = 3;
const trigs = [];
let grids_x = null;
let grids_y = null;

const params = {
  gridResolution: {
    options: [ 'Quarters', '8ths', '16ths', '32nds' ],
    value: 16, // 4|8|16|32
  },
  pattern: {
    value: 1 // min 0, max NUM_PATTERNS - 1
  },
  patternLength: {
    value: 16, // min 0, max MAX_PATTERN_LENGTH - 1
  },
  gridsPatternX: {
    value: 0, // min 0, max 255
  },
  gridsPatternY: {
    value: 1, // min 0, max 255
  },
};

/**
 * Create the trigger matrix.
 * Array [NUM_PATTERNS][NUM_TRACKS][MAX_PATTERN_LENGTH]
 */
function initTrigs() {
  for (let patternIndex = 0; patternIndex < NUM_PATTERNS; patternIndex++) {
    trigs[patternIndex] = [];
    for (let y = 0; y < NUM_TRACKS; y++) {
      trigs[patternIndex][y] = [];
      for (let x = 0; x < MAX_PATTERN_LENGTH; x++) {
        trigs[patternIndex][y][x] = 0;
      }
    }
  }
}

/**
 *
 *
 * @param {*} patternIndex
 * @param {*} x
 * @param {*} y
 * @param {*} force
 */
function setGridsXY(patternIndex, x, y, force = true) {

  // The drumMap is at 32nd-note resolution,
  // so we'll want to set different triggers depending on our desired grid resolution.
  const gridResolution = params.gridResolution.value;
  const stepOffsetMultiplier = Math.floor(32 / gridResolution);
  const patternLength = params.patternLength.value;

  // Chose four drum map nodes based on the first two bits of x and y.
  const i = Math.floor(x / 64); // (x >> 6)
  const j = Math.floor(y / 64); // (y >> 6)
  const a_map = drumMap.map[j][i];
  const b_map = drumMap.map[j + 1][i];
  const c_map = drumMap.map[j][i + 1];
  const d_map = drumMap.map[j + 1][i + 1];
  for (let trackIndex = 0; trackIndex < NUM_TRACKS; trackIndex++) {
    const trackOffset = trackIndex * drumMap.PATTERN_LENGTH;
    for (let stepIndex = 0; stepIndex < patternLength; stepIndex++) {
      const stepOffset = (stepIndex * stepOffsetMultiplier) % drumMap.PATTERN_LENGTH;
      const offset = trackOffset + stepOffset;
      const a = a_map[offset];
      const b = b_map[offset];
      const c = c_map[offset];
      const d = d_map[offset];

      // Crossfade between the values at the chosen drum nodes depending on the last 6 bits of x and y.
      const x_xfade = (x * 4) % 256; // x << 2
      const y_xfade = (y * 4) % 256; // y << 2
      const trigLevel = u8mix(u8mix(a, b, y_xfade), u8mix(c, d, y_xfade), x_xfade);
      setTrig(patternIndex, stepIndex, trackIndex, trigLevel);
    }
  }
  grids_x = x;
  grids_y = y;
  console.table(trigs[patternIndex]);
}

/**
 *
 *
 * @param {*} patternIndex
 * @param {*} step
 * @param {*} track
 * @param {*} value
 */
function setTrig(patternIndex, step, track, value) {
  trigs[patternIndex][track][step] = value;
}

/**
 * 
 */
export function setup() {
  initTrigs();
  setGridsXY(params.pattern.value, params.gridsPatternX.value, params.gridsPatternY.value);
}

/**
 *
 *
 * @param {Number} a
 * @param {Number} b
 * @param {Number} mix
 * @returns {Number} 
 */
function u8mix(a, b, mix) {
  // Roughly equivalent to ((mix * b + (255 - mix) * a) >> 8), if this is too non-performant.
  return Math.round(((mix * b) + ((255 - mix) * a)) / 255);
}
