import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import { allocVoice, freeVoice, getVoices } from './voices.js';
import { getContext } from './audio.js';
import { getBuffer } from './buffers.js';

const createVoice = function(when, sampleStartOffset, playbackDuration, buffer) {
  const ctx = getContext();
  const voice = allocVoice();

  voice.source = ctx.createBufferSource();
  voice.source.buffer = buffer;
  voice.source.connect(voice.gain);

  voice.gain.gain.setValueAtTime(0.0001, when);
  voice.gain.gain.exponentialRampToValueAtTime(1, when + 0.004);
  voice.gain.gain.setValueAtTime(0.0001, when + playbackDuration);
  voice.gain.gain.exponentialRampToValueAtTime(0.0001, when + playbackDuration + 0.004);

  voice.source.onended = function(e) {
    voice.source.disconnect();
    freeVoice(voice);
  };

  voice.source.start(when, sampleStartOffset);
  voice.source.stop(when + playbackDuration);
};

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
      stopAllVoices();
      break;

    case actions.ADVANCE_TIME:
      play(state, action);
      break;
  }
}

export function play(state, action) {
  const { when, index } = action;
  const {settings, tracks } = state;
  const { loopDurationInSecs } = settings;

  tracks.allIds.forEach(trackId => {
    const { gain, pattern, playbackDuration, sampleId, sampleStartOffset, } = tracks.byId[trackId];
    const buffer = getBuffer(sampleId);
    pattern.forEach(note => {
      createVoice(when + (loopDurationInSecs * note.time), sampleStartOffset, playbackDuration, buffer);
    });
  });
}

/**
 * General module setup.
 */
export function setup() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

/**
 * Stop all scheduled patterns.
 */
function stopAllVoices() {
  getVoices().forEach(voice => {
    if (voice.source) {
      voice.source.stop();
      voice.source.disconnect();
      freeVoice(voice);
    }
  });
};
