import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import { allocVoice, freeVoice, getVoices } from './voices.js';
import { getContext } from './audio.js';
import { getBuffer } from './buffers.js';

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
  const {settings, score, tracks } = state;
  const { loopDurationInSecs } = settings;
  const patternIndex = score[index % score.length];

  tracks.allIds.forEach(trackId => {
    const { gain, reverbSendGain, pan, patterns, playbackDuration, sampleId, sampleStartOffset, } = tracks.byId[trackId];
    const buffer = getBuffer(sampleId);
    patterns[patternIndex].forEach(note => {
      const { velocity, time, } = note;
      startVoice(when + (loopDurationInSecs * time), sampleStartOffset, playbackDuration, buffer, velocity, pan, reverbSendGain);
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
 *
 *
 * @param {*} when
 * @param {*} sampleStartOffset
 * @param {*} playbackDuration
 * @param {*} buffer
 * @param {*} velocity
 * @param {*} pan
 */
function startVoice(when, sampleStartOffset, playbackDuration, buffer, velocity, pan = 0, reverbSendGain = 0) {
  const ctx = getContext();
  const voice = allocVoice();
  const gainValue = velocityToGain(velocity);

  voice.source = ctx.createBufferSource();
  voice.source.buffer = buffer;
  voice.source.connect(voice.gain);
  voice.source.connect(voice.convolverSendGain);
  voice.gain.gain.setValueAtTime(0.0001, when);
  voice.gain.gain.exponentialRampToValueAtTime(gainValue, when + 0.004);
  voice.gain.gain.setValueAtTime(gainValue, when + playbackDuration);
  voice.gain.gain.exponentialRampToValueAtTime(0.0001, when + playbackDuration + 0.004);
  voice.pan.pan.setValueAtTime(pan, when);
  voice.convolverSendGain.gain.setValueAtTime(reverbSendGain, when);

  voice.source.onended = function(e) {
    voice.source.disconnect();
    freeVoice(voice);
  };

  voice.source.start(when, sampleStartOffset);
  voice.source.stop(when + playbackDuration);
};

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

/**
 * Convert MIDI velocity to gain level.
 * @param {Number} velocity
 * @returns
 */
function velocityToGain(velocity) {
  return velocity ** 2 / 127 ** 2;
}
