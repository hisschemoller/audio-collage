import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

let convolver, convolverGain;

/**
 * Handle application state changes.
 * @param {Event} e Custom event.
 */
function handleStateChanges(e) {}

/**
 * General module setup.
 * @param {Object} ctx AudioContext.
 * @returns {Object} Promise.
 */
export function setup(ctx) {
  document.addEventListener(STATE_CHANGE, handleStateChanges);

  return new Promise((resolve, reject) => {

    convolverGain = ctx.createGain();
    convolverGain.gain.value = 0.8;
    convolverGain.connect(ctx.destination);

    convolver = ctx.createConvolver();
    convolver.connect(convolverGain);

    // load reverb impulse response file
    fetch('audio/528522__tc630__ms-room-verb-ir.wav').then(response => {
      response.arrayBuffer().then(arraybuffer => {
        ctx.decodeAudioData(arraybuffer).then(buffer => {
          convolver.buffer = buffer;
          resolve(convolver);
        });
      });
    });
  });
}
