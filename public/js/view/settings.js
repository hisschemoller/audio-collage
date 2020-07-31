import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

let rootEl, loopDurEl, numSamplesEl, numTracksEl;

function addEventListeners() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);

  loopDurEl.addEventListener('input', e => {
    dispatch(getActions().setSetting('loopDurationInSecs', parseFloat(e.target.value, 10)));
  });

  numSamplesEl.addEventListener('input', e => {
    dispatch(getActions().setSetting('numSamples', parseFloat(e.target.value, 10)));
  });

  numTracksEl.addEventListener('input', e => {
    dispatch(getActions().setSetting('numTracks', parseFloat(e.target.value, 10)));
  });
}

/**
 * Handle application state changes.
 * @param {Event} e Custom event.
 */
function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.NEW_PROJECT:
    case actions.SET_PROJECT:
    case actions.SET_SETTING:
      updateSettings(state);
      break;
  }
}

/**
 * General module setup.
 */
export function setup() {
  rootEl = document.querySelector('#settings');
  loopDurEl = rootEl.querySelector('#settings__loopduration');
  numSamplesEl = rootEl.querySelector('#settings__numsamples');
  numTracksEl = rootEl.querySelector('#settings__numtracks');
  addEventListeners();
}

function updateSettings(state) {
  const { loopDurationInSecs, numSamples, numTracks } = state.settings;
  loopDurEl.value = loopDurationInSecs;
  numSamplesEl.value = numSamples;
  numTracksEl.value = numTracks;
}
