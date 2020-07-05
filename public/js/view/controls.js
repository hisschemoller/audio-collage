import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

let rootEl;
let resetKeyCombo = [];

export function setup() {
  rootEl = document.querySelector('#controls');
  addEventListeners();
}

function addEventListeners() {
  document.addEventListener('keydown', e => {

    // don't perform shortcuts while typing in a text input.
    if (!(e.target.tagName.toLowerCase() == 'input' && e.target.getAttribute('type') == 'text')) {
      switch (e.keyCode) {
        
        // w
        case 87:
          console.log(getState());
          break;
      }
    }
  });
}

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {
    case actions.ACTION:
      break;
  }
}
