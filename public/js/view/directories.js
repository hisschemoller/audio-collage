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
      const { isEnabled, path } = directories.byId[dirId];
      const template = document.querySelector('#template-dir');
      const clone = template.content.cloneNode(true);
      const el = clone.firstElementChild;
      console.log(el);
      el.dataset.id = dirId;
      el.querySelector('.dir__path').value = path;
      el.querySelector('.dir__disable').checked = !isEnabled;
      el.querySelector('.dir__path').addEventListener('keyup', e => {
        if (e.keyCode === 13) {
          e.target.blur();
          dispatch(getActions().directoryPathChange(dirId, e.target.value));
        }
      });
      el.querySelector('.dir__delete').addEventListener('click', e => {
        dispatch(getActions().directoryRemove(dirId));
      });
      el.querySelector('.dir__disable').addEventListener('click', e => {
        dispatch(getActions().directoryToggleEnable(dirId));
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
}

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.DIRECTORY_ADD:
    case actions.DIRECTORY_REMOVE:
    case actions.NEW_PROJECT:
    case actions.SET_PROJECT:
      updateDirectories(state);
      break;
    
    case actions.DIRECTORY_PATH_CHANGE:
    case actions.DIRECTORY_TOGGLE_ENABLE:
      updateDirectoriesContent(state);
      break;
  }
}

/**
 * Update the enabled state of each directory.
 * @param {Object} state 
 */
function updateDirectoriesContent(state) {
  const { directories, } = state;
  directories.allIds.forEach(dirId => {
    const { isEnabled, path } = directories.byId[dirId];
    const dirEl = listEl.querySelector(`.dir[data-id="${dirId}"]`);
    dirEl.querySelector('.dir__disable').checked = !isEnabled;
    dirEl.querySelector('.dir__path').value = path;
  });
}
