import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import { sounds } from '../util/constants.js'

let rootEl, listEl, addBtn;
let resetKeyCombo = [];

/**
 * General module setup.
 */
export function setup() {
  rootEl = document.querySelector('#paths');

  sounds.forEach(sound => {
    const template = document.querySelector('#template-dirs');
    const clone = template.content.cloneNode(true);
    const el = clone.firstElementChild;
    el.dataset.sound = sound;
    el.querySelector('.dirs__label').textContent = `${sound} audio folder locations`;
    el.querySelector('.dirs__add').addEventListener('click', e => {
      dispatch(getActions().directoryAdd(sound));
    });
    rootEl.appendChild(el);
  });

  // listEl = rootEl.querySelector('#dirs__list');
  // addBtn = rootEl.querySelector('#dirs__add');
  addEventListeners();
}

function addEventListeners() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

/**
 * HAndle application state changes.
 * @param {Event} e Custom event.
 */
function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.DIRECTORY_ADD:
    case actions.DIRECTORY_REMOVE:
    case actions.NEW_PROJECT:
    case actions.SET_PROJECT:
      updateDirectories(state);
      uploadState(state);
      break;
    
    case actions.DIRECTORY_PATH_CHANGE:
    case actions.DIRECTORY_TOGGLE_ENABLE:
      updateDirectoriesContent(state);
      uploadState(state);
      break;
  }
}

/**
 * Add a directory item to the list.
 * @param {Object} state Application state.
 */
function updateDirectories(state) {
  const { directories, } = state;
  sounds.forEach(sound => {
    const dirsEl = rootEl.querySelector(`.dirs[data-sound='${sound}'`);
    const listEl = dirsEl.querySelector('.dirs__list');
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
      const { isEnabled, path, sound: dirSound} = directories.byId[dirId];
      if (sound === dirSound) {
        if (!listEl.querySelector(`.dir[data-id="${dirId}"]`)) {
          const template = document.querySelector('#template-dir');
          const clone = template.content.cloneNode(true);
          const el = clone.firstElementChild;
          el.dataset.id = dirId;
          el.querySelector('.dir__path').value = path;
          el.querySelector('.dir__disable').checked = !isEnabled;
          el.querySelector('.dir__path').addEventListener('input', e => {
            dispatch(getActions().directoryPathChange(dirId, e.target.value));
          });
          el.querySelector('.dir__delete').addEventListener('click', e => {
            dispatch(getActions().directoryRemove(dirId));
          });
          el.querySelector('.dir__disable').addEventListener('click', e => {
            dispatch(getActions().directoryToggleEnable(dirId));
          });
          listEl.appendChild(el);
        }
      }

      // const dirsEl = rootEl.querySelector(`.dirs[data-sound='${sound}'`);
      // const listEl = dirsEl.querySelector('.dirs');
      // console.log(listEl.querySelector(`.dir[data-id="${dirId}"]`));
      
    });
  });
}

/**
 * Update the enabled state of each directory.
 * @param {Object} state Application state.
 */
function updateDirectoriesContent(state) {
  const { directories, } = state;
  directories.allIds.forEach(dirId => {
    const { isEnabled, path, sound } = directories.byId[dirId];
    const dirEl = rootEl.querySelector(`.dirs[data-sound='${sound}'] .dir[data-id='${dirId}']`);
    dirEl.querySelector('.dir__disable').checked = !isEnabled;
    dirEl.querySelector('.dir__path').value = path;
  });
}

/**
 * Update the enabled state of each directory.
 * @param {Object} state Application state.
 */
async function uploadState(state) {
  const { directories } = state;
  const data = directories.allIds.reduce((accumulator, dirId) => {
    const { isEnabled, path, type } = directories.byId[dirId];
    if (isEnabled && path !== '') {
      return [ ...accumulator, { path, type } ];
    }
    return [ ...accumulator ];
  }, []);

  const result = fetch('/paths', {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
}
