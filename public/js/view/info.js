import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

let rootEl;

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.GENERATE:
      updateInfo(state);
      break;
  }
}

export function setup() {
  rootEl = document.querySelector('#info');
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

function updateInfo(state) {
  const { sounds, tracks, } = state;
  let html = '<table>';
  tracks.allIds.forEach(trackId => {
    const { sampleId, sampleStartOffset } = tracks.byId[trackId];
    const { dir, duration, file } = sounds.byId[sampleId];
    html += `<tr><td>${sampleStartOffset.toFixed(2)}s</td><td>${duration.toFixed(2)}s</td><td>${file}</td></tr>`;
  });
  html += `</table>`;

  rootEl.innerHTML = html;
}