import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

let rootEl;

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
      updateInfo(state);
      break;
  }
}

/**
 * General module setup.
 */
export function setup() {
  rootEl = document.querySelector('#info > .panel__content');
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

function updateInfo(state) {
  const { sounds, tracks, } = state;
  let html = '<table>';
  html += `<tr><th>offset</th><th>duration</th><th>file</th></tr>`;
  tracks.allIds.forEach(trackId => {
    const { sampleId, sampleStartOffset } = tracks.byId[trackId];
    const { dir, duration, file } = sounds.byId[sampleId];
    html += `<tr><td>${sampleStartOffset.toFixed(2)}s</td><td>${duration.toFixed(2)}s</td><td>${file}</td></tr>`;
  });
  html += `</table>`;

  rootEl.innerHTML = html;
}