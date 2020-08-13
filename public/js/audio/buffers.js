import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import { getContext } from './audio.js';

const buffers = {
  allIds: [],
  byId: {},
};

/**
 * Provide audio buffer.
 * @param {String} id Buffer ID.
 * @returns {Object} AudioBuffer.
 */
export function getBuffer(id) {
  return buffers.byId[id].buffer;
}

/**
 * Handle application state changes.
 * @param {Event} e Custom event.
 */
function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.GENERATE:
    case actions.NEW_PROJECT:
    case actions.SET_PROJECT:
      update(state);
      break;
  }
}

/**
 * General module setup.
 */
export function setup() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

/**
 * Load all audiofiles and store in buffers.
 * @param {Object} state 
 */
function update(state) {
  const { sounds } = state;
  const ctx = getContext();
  
  // remove sounds not in state
  let i = buffers.length;
  while (--i >= 0) {
    const bufferId = buffers.allIds[i];
    if (sounds.allIds.indexOf(bufferId) === -1) {
      buffers.allIds.splice(i, 1);
      delete buffers.byId[bufferId];
    }
  }

  // load audio file, 
  // inline function so it has access to the state parameter
  const loadSound = soundId => {
    return new Promise((resolve, reject) => {
      const { dir, file } = sounds.byId[soundId];
      const url = `/sound?dir=${encodeURIComponent(dir)}&file=${encodeURIComponent(file)}`
      fetch(url).then(response => {
        if (response.status === 200) {
          response.arrayBuffer().then(arrayBuffer => {
            ctx.decodeAudioData(arrayBuffer).then((audioBuffer) => {
              buffers.allIds.push(soundId);
              buffers.byId[soundId] = {
                buffer: audioBuffer,
              };
              resolve(soundId);
            });
          })
        } else {
          reject(soundId);
        }
      });
    });
  };

  Promise.allSettled(sounds.allIds.map(loadSound)).then(results => {
    dispatch(getActions().buffersLoaded());
  });
}
