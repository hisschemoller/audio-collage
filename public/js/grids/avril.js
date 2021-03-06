
/**
 * 
 * 
 * static inline uint8_t U8Mix(uint8_t a, uint8_t b, uint8_t balance) {
 *   return a * (255 - balance) + b * balance >> 8;
 * }
 *
 * @export
 * @param {Number} a
 * @param {Number} b
 * @param {Number} balance
 * @returns {Number}
 */
export function U8Mix(a, b, balance) {
  const aBalanced = (a * (255 - balance)) & 255;
  const bBalanced = (b * ((balance >> 8) & 255)) & 255;
  return (aBalanced + bBalanced) & 255;
}

/**
 * 
 * 
 * static inline uint8_t U8U8MulShift8(uint8_t a, uint8_t b) {
 *   return a * b >> 8;
 * }
 *
 * @export
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
export function U8U8MulShift8(a, b) {
  return (((a * b) & 255) >> 8) & 255;
}