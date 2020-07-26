import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

let rootEl, generateBtn, playCheck;
let resetKeyCombo = [];

function addEventListeners() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);

  generateBtn.addEventListener('click', e => {
    dispatch(getActions().generate());
  });

  playCheck.addEventListener('change', e => {
    dispatch(getActions().setTransport('toggle'));
  });

  rootEl.querySelector('#file-export').addEventListener('click', () => {
    dispatch(getActions().projectExport());
  });

  rootEl.querySelector('#file-import').addEventListener('change', e => {
    dispatch(getActions().projectImport(e.target.files[0]));
  });

  document.addEventListener('keydown', e => {

    // don't perform shortcuts while typing in a text input.
    if (!(e.target.tagName.toLowerCase() == 'input' && e.target.getAttribute('type') == 'text')) {
      switch (e.keyCode) {
        
        case 87: // w
          console.log(getState());
          break;

        case 82: // r
        case 83: // s
        case 84: // t

          // clear all data on key combination 'rst' (reset)
          resetKeyCombo.push(e.keyCode);
          if (resetKeyCombo.indexOf(82) > -1 && resetKeyCombo.indexOf(83) > -1 && resetKeyCombo.indexOf(84) > -1) {
            localStorage.clear();
            dispatch(getActions().newProject());
          }
          break;
      }
    }
  });
}

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.GENERATE:
    case actions.NEW_PROJECT:
    case actions.SET_PROJECT:
    case actions.SET_TRANSPORT:
      updatePlayButton(state);
      break;
  }
}

export function setup() {
  rootEl = document.querySelector('#controls');
  generateBtn = rootEl.querySelector('#controls__generate');
  playCheck = rootEl.querySelector('#controls__play');
  addEventListeners();
}

function updatePlayButton(state) {
  playCheck.checked = state.transport === 'play';
}
