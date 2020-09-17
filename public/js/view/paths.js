import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import { types } from '../util/constants.js'

let rootEl, listEl, addBtn;
let resetKeyCombo = [];

/**
 * General module setup.
 */
export function setup() {
  rootEl = document.querySelector('#paths');

  types.forEach(type => {
    const template = document.querySelector('#template-dirs');
    const clone = template.content.cloneNode(true);
    const el = clone.firstElementChild;
    el.dataset.type = type;
    el.querySelector('.dirs__label').textContent = `${type} audio folder locations`;
    el.querySelector('.dirs__add').addEventListener('click', e => {
      dispatch(getActions().directoryAdd(type));
    });
    rootEl.appendChild(el);
  });

  addEventListeners();
}

function addEventListeners() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

/**
 * Handle application state changes.
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
  console.log(state);
  const { directories, } = state;
  types.forEach(type => {
    const dirsEl = rootEl.querySelector(`.dirs[data-type='${type}'`);
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
      const { isEnabled, path, type: dirSound} = directories.byId[dirId];
      if (type === dirSound) {
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
    const { isEnabled, path, type } = directories.byId[dirId];
    const dirEl = rootEl.querySelector(`.dirs[data-type='${type}'] .dir[data-id='${dirId}']`);
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

  // create paths data for server
  const data = directories.allIds.reduce((accumulator, dirId) => {
    const { isEnabled, path, type } = directories.byId[dirId];
    if (isEnabled && path !== '') {
      return [ ...accumulator, { path, type } ];
    }
    return [ ...accumulator ];
  }, []);

  // send updated paths data to server
  await fetch('/paths', {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log('result', result);
  });
}
