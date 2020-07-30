import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import createSamplePlayer from './player.js';
import { setup as setupVoices } from './voices.js';

const buffers = {
  allIds: [],
  byId: {},
};
const players = [];
let ctx;
let index = 0;
let loopDurationInSecs = 1;
let next = 0;
let isRunning = false;

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.GENERATE:
    case actions.NEW_PROJECT:
    case actions.SET_PROJECT:
      stop();
      updateBuffers(state);
      break;

    case actions.SET_TRANSPORT:
      updatePlayback(state);
      break;
  }
}

export function initAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    setupVoices(ctx);
  }
}

function run() {
  if (ctx.currentTime <= next && ctx.currentTime + 0.167 > next) {
    var delay = next - ctx.currentTime;
    players.forEach(player => {
      player.play(next, index);
    });
    index += 1;
    next += loopDurationInSecs;
  }
  if (isRunning) {
    requestAnimationFrame(run);
  }
}

export function setup() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

function setupScore(state) {
  const {settings, tracks } = state;
  const { loopDurationInSecs } = settings;
  // loopDurationInSecs = s;
  console.log(loopDurationInSecs);
  players.length = 0;

  tracks.allIds.forEach(trackId => {
    const { pattern, sampleDuration, sampleId, sampleStartOffset, } = tracks.byId[trackId];
    const buffer = buffers.byId[sampleId].buffer;
    players.push(createSamplePlayer({
      buffer, ctx, loopDurationInSecs, pattern, sampleDuration, sampleStartOffset,
    }));
  });
}

function start(delay = 0) {
  console.trace();
  setTimeout(function() {
    isRunning = true;
    next = ctx.currentTime;
    run();
  }, delay);
}

function stop() {
  index = 0;
  isRunning = false;
  next = 0;
  players.forEach(player => player.stop());
}

/**
 * Load all audiofiles and store in buffers.
 * @param {Object} state 
 */
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

  // add sounds not in buffers
  Promise.allSettled(sounds.allIds.map(loadSound)).then(results => {
    setupScore(state);
    // start(10);
  });
}

function updatePlayback(state) {
  const { transport } = state;
  switch (transport) {

    case 'play':
      start(10);
      break;
    
    case 'pause':
    case 'stop':
      stop();
      break;
  }
}
