import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import { setup as setupVoices } from './voices.js';

let ctx;
let index = 0;
let loopDurationInSecs = 1;
let next = 0;
let isRunning = false;

export function getContext() {
  return ctx;
}

/**
 * Handle application state changes.
 * @param {Event} e Custom event.
 */
function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.BUFFERS_LOADED:
      updatePlayback(state);
      break;

    case actions.GENERATE:
    case actions.NEW_PROJECT:
    case actions.SET_PROJECT:
      stop();
      update(state);
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
    dispatch(getActions().advanceTime(next, index));
    index += 1;
    next += loopDurationInSecs;
  }
  if (isRunning) {
    requestAnimationFrame(run);
  }
}

/**
 * General module setup.
 */
export function setup() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

function start(delay = 0) {
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
}

function update(state) {
  const { settings } = state;
  ({ loopDurationInSecs } = settings);
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
