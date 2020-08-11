import DrumMap = from './grids_patterns.js';

const MAX_PATTERN_LENGTH = 32;
const NUM_PATTERNS = 50;
const NUM_TRACKS = 3;
const trigs = {};
let grids_x = null;
let grids_y = null;

const params = {
  grid_resolution: {
    options: {'Quarters', '8ths', '16ths', '32nds'},
    value: 16, // 4|8|16|32
  },
  pattern: {
    value: 1 // min 1, max NUM_PATTERNS
  },
  pattern_length: {
    value: 16 // min 1, max MAX_PATTERN_LENGTH
  },
  grids_pattern_x: {
    value: 0 // min 0, max 255
  },
  grids_pattern_y: {
    value: 0 // min 0, max 255
  },
};

/**
 * Create the trigger matrix.
 * Array [NUM_PATTERNS][NUM_TRACKS][MAX_PATTERN_LENGTH]
 */
function _init_trigs() {
  for (let patternno = 1; patternno <= NUM_PATTERNS; patternno++) {
    trigs[patternno] = [];
    for (let y = 1; y <= NUM_TRACKS; y++) {
      trigs[patternno][y] = [];
      for (let x = 1; x <= MAX_PATTERN_LENGTH; x++) {
        trigs[patternno][y][x] = 0;
      }
    }
  }
}

/**
 *
 *
 * @param {*} patternno
 * @param {*} x
 * @param {*} y
 * @param {*} force
 */
function set_grids_xy(patternno, x, y, force = true) {

  // The DrumMap is at 32nd-note resolution,
  // so we'll want to set different triggers depending on our desired grid resolution.
  const grid_resolution = params.grid_resolution.value;
  const step_offset_multiplier = Math.floor(32 / grid_resolution);
  const pattern_length = params.pattern_length.value;

  // Chose four drum map nodes based on the first two bits of x and y.
  const i = Math.floor(x / 64) + 1 -- (x >> 6) + 1;
  const j = Math.floor(y / 64) + 1 -- (y >> 6) + 1;
  const a_map = DrumMap.map[j][i];
  const b_map = DrumMap.map[j + 1][i];
  const c_map = DrumMap.map[j][i + 1];
  const d_map = DrumMap.map[j + 1][i + 1];
  for (let trackIndex = 1; trackIndex <= NUM_TRACKS; trackIndex++) {
    const track_offset = ((trackIndex - 1) * DrumMap.PATTERN_LENGTH);
    for (stepIndex = 1; stepIndex <= pattern_length; stepIndex++) {
      const step_offset = (((stepIndex - 1) * step_offset_multiplier) % DrumMap.PATTERN_LENGTH) + 1;
      const offset = track_offset + step_offset;
      const a = a_map[offset];
      const b = b_map[offset];
      const c = c_map[offset];
      const d = d_map[offset];

      // Crossfade between the values at the chosen drum nodes depending on the last 6 bits of x and y.
      const x_xfade = (x * 4) % 256; // x << 2
      const y_xfade = (y * 4) % 256; // y << 2
      const trig_level = u8mix(u8mix(a, b, y_xfade), u8mix(c, d, y_xfade), x_xfade);
      set_trig(patternno, stepIndex, trackIndex, trig_level);
    }
  }
  grids_x = x;
  grids_y = y;
}

/**
 *
 *
 * @param {*} patternno
 * @param {*} step
 * @param {*} track
 * @param {*} value
 */
function set_trig(patternno, step, track, value) {
  trigs[patternno][track][step] = value;
}

/**
 * 
 */
export function setup() {
  _init_trigs();
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
