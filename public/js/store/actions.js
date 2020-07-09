import { createUUID } from '../system/utils.js';

const ACTION = 'ACTION';
const DIRECTORY_ADD = 'DIRECTORY_ADD';
const DIRECTORY_PATH_CHANGE = 'DIRECTORY_PATH_CHANGE';
const DIRECTORY_REMOVE = 'DIRECTORY_REMOVE';
const DIRECTORY_TOGGLE_ENABLE = 'DIRECTORY_TOGGLE_ENABLE';
const NEW_PROJECT = 'NEW_PROJECT';
const SET_PROJECT = 'SET_PROJECT';

// actions
export default {

  DIRECTORY_ADD,
  directoryAdd: () => ({ type: DIRECTORY_ADD, id: createUUID() }),

  DIRECTORY_PATH_CHANGE,
  directoryPathChange: (id, path) => ({ type: DIRECTORY_PATH_CHANGE, id, path }),

  DIRECTORY_REMOVE,
  directoryRemove: id => ({ type: DIRECTORY_REMOVE, id }),

  DIRECTORY_TOGGLE_ENABLE,
  directoryToggleEnable: id => ({ type: DIRECTORY_TOGGLE_ENABLE, id }),

  NEW_PROJECT,
  newProject: () => ({ type: NEW_PROJECT }),
  
  SET_PROJECT,
  setProject: state => ({ type: SET_PROJECT, state }),
};
