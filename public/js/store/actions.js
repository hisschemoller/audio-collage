import { createUUID } from '../system/utils.js';

const ACTION = 'ACTION';
const DIRECTORY_ADD = 'DIRECTORY_ADD';
const DIRECTORY_REMOVE = 'DIRECTORY_REMOVE';
const NEW_PROJECT = 'NEW_PROJECT';

// actions
export default {

  DIRECTORY_ADD,
  directoryAdd: () => ({ type: DIRECTORY_ADD, id: createUUID() }),

  DIRECTORY_REMOVE,
  directoryRemove: id => ({ type: DIRECTORY_REMOVE, id }),

  NEW_PROJECT,
  newProject: () => ({ type: NEW_PROJECT }),
};
