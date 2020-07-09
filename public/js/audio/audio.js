import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

const buffers = {
  allIds: [],
  byId: {},
};
let ctx;

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.GENERATE:
      initAudio();
      updateBuffers(state);
      break;
  }
}

function initAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

export function setup() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

function updateBuffers(state) {
  const { sounds } = state;
  
  // remove sounds not in state
  let i = buffers.length;
  while (--i >= 0) {
    const bufferId = buffers.allIds[i];
    if (sounds.allIds.indexOf(bufferId) === -1) {
      buffers.allIds.splice(i, 1);
      delete buffers.byId[bufferId];
    }
  }

  // add sounds not in buffers
  sounds.allIds.forEach(soundId => {
    const { dir, file } = sounds.byId[soundId];
    const url = `http://localhost:3015/sound?dir=${encodeURIComponent(dir)}&file=${encodeURIComponent(file)}`
    fetch(url).then(response => {
      if (response.status === 200) {
        response.arrayBuffer().then(arrayBuffer => {
          ctx.decodeAudioData(arrayBuffer).then((audioBuffer) => {
            buffers.allIds.push(soundId);
            buffers.byId[soundId] = {
              buffer: audioBuffer,
            };
          });
        })
      }
    });
  });
}
