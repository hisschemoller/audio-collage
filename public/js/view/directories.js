import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

let rootEl, listEl, addBtn;
let resetKeyCombo = [];

export function setup() {
  rootEl = document.querySelector('#dirs');
  listEl = rootEl.querySelector('#dirs__list');
  addBtn = rootEl.querySelector('#dirs__add');
  addEventListeners();
}

/**
 * Add a directory item to the list.
 * @param {Object} state 
 */
function updateDirectories(state) {
  const { directories, } = state;
  const dirEls = listEl.querySelectorAll('.dir');
  
  // delete all directories not found in the state anymore
  let i = dirEls.length;
  while (--i >= 0) {
    const dirEl = dirEls.item(i);
    const dirId = dirEl.dataset.id;
    if (directories.allIds.indexOf(dirId) === -1) {
      listEl.removeChild(dirEl);
    }
  }

  // create all directories that don't exist yet
  directories.allIds.forEach(dirId => {
    if (!listEl.querySelector(`.dir[data-id="${dirId}"]`)) {
      const template = document.querySelector('#template-dir');
      const clone = template.content.cloneNode(true);
      const el = clone.firstElementChild;
      el.dataset.id = dirId;
      el.querySelector('.dir__label').textContent = directories.byId[dirId].path;
      el.querySelector('.dir__delete').addEventListener('click', e => {
        dispatch(getActions().directoryRemove(dirId));
      });
      listEl.appendChild(el);
    }
  });
}

function addEventListeners() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
  
  addBtn.addEventListener('click', e => {
    dispatch(getActions().directoryAdd());
  });
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

    case actions.DIRECTORY_ADD:
    case actions.DIRECTORY_REMOVE:
      updateDirectories(state);
      break;
  }
}
