import nodes from './lookup-tables.js';
import { U8Mix, U8U8MulShift8 } from './avril.js';

const kNumParts = 3;
const kStepsPerPattern = 32;
const part_perturbation_ = new Array(kNumParts);
let step_ = 0;
let state_ = 0;

const drum_map = [
  [ nodes[10], nodes[8], nodes[0], nodes[9], nodes[11] ],
  [ nodes[15], nodes[7], nodes[13], nodes[12], nodes[6] ],
  [ nodes[18], nodes[14], nodes[4], nodes[5], nodes[3] ],
  [ nodes[23], nodes[16], nodes[21], nodes[1], nodes[2] ],
  [ nodes[24], nodes[19], nodes[17], nodes[20], nodes[22] ],
];

const options_ = {
  swing: 0,
};

const settings_ = {
  density: [100, 100, 100],
  options: {
    drums: {
      randomness: 0,
      x: 0,
      y: 0,
    },
  },
};

function Reset() {
  step_ = 0;
}

/**
 *
 *
 * @param {Number} step
 * @param {Number} instrument
 * @param {Number} x
 * @param {Number} y
 * @returns {Number} 
 */
function ReadDrumMap(step, instrument, x, y) {
  const i = x >> 6;
  const j = y >> 6;
  const a_map = drum_map[i][j];
  const b_map = drum_map[i + 1][j];
  const c_map = drum_map[i][j + 1];
  const d_map = drum_map[i + 1][j + 1];
  const offset = (instrument * kStepsPerPattern) + step;
  const a = a_map[offset]; // pgm_read_byte(a_map + offset);
  const b = b_map[offset]; // pgm_read_byte(b_map + offset);
  const c = c_map[offset]; // pgm_read_byte(c_map + offset);
  const d = d_map[offset]; // pgm_read_byte(d_map + offset);
  return U8Mix(U8Mix(a, b, x << 2), U8Mix(c, d, x << 2), y << 2);
}

/**
 * 
 */
function EvaluateDrums() {
  state_ = 0;
  const levels = [];

  // At the beginning of a pattern, decide on perturbation levels.
  if (step_ == 0) {
    for (let i = 0; i < kNumParts; i++) {
      const randomness = options_.swing ? 0 : settings_.options.drums.randomness >> 2;
      part_perturbation_[i] = U8U8MulShift8(RandomGetByte(), randomness);
    }
  }
  
  const x = settings_.options.drums.x;
  const y = settings_.options.drums.y;
  let instrument_mask = 1;
  let accent_bits = 0;
  for (let i = 0; i < kNumParts; i++) {
    let level = ReadDrumMap(step_, i, x, y);
    if (level < 255 - part_perturbation_[i]) {
      level += part_perturbation_[i];
    } else {

      // The sequencer from Anushri uses a weird clipping rule here. Comment
      // this line to reproduce its behavior.
      level = 255;
    }
    const threshold = invertUint8Binary(settings_.density[i]); // ~ invert all bits
    if (level > threshold) {
      if (level > 192) {
        accent_bits |= instrument_mask;
      }
      state_ |= instrument_mask;
    }
    instrument_mask <<= 1;

    levels.push(level);
  }
  // if (output_clock()) {
  //   state_ |= accent_bits ? OUTPUT_BIT_COMMON : 0;
  //   state_ |= step_ == 0 ? OUTPUT_BIT_RESET : 0;
  // } else {
    state_ |= accent_bits << 3;
  // }

  return levels;
}

/**
 *
 *
 * @returns {Number} Random 0 - 255
 */
function RandomGetByte() {
  return Math.floor(Math.random() * 256);
}

/**
 * https://stackoverflow.com/questions/4338315/inverting-a-binary-value-of-a-number
 *
 * @param {Number} value Number 0 - 255
 * @returns {Number} Input bitflipped.
 */
function invertUint8Binary(value) {
  return value ^ 0xff;
}

/**
 *
 *
 * @export
 * @returns
 */
export function createPattern(x = 0, y = 0, randomness = 0,) {

  // settings
  settings_.options.drums.x = Math.max(0, Math.min(x, 255));
  settings_.options.drums.y = Math.max(0, Math.min(y, 255));
  settings_.options.drums.randomness = Math.max(0, Math.min(randomness, 255));

  // generate
  const pattern = [];
  for (let i = 0; i < kStepsPerPattern; i++) {
    step_ = i;
    EvaluateDrums();
    pattern.push([(state_ & 1) === 1, (state_ & 2) === 2, (state_ & 4) === 4]);
  }
  return pattern;
}
