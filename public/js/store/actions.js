import { createUUID } from '../system/utils.js';

const ACTION = 'ACTION';
const DIRECTORY_ADD = 'ADD_DIRECTORY_ADD';
const NEW_PROJECT = 'NEW_PROJECT';

// actions
export default {

  DIRECTORY_ADD,
  directoryAdd: () => ({ type: DIRECTORY_ADD, id: createUUID() }),

  NEW_PROJECT,
  newProject: () => ({ type: NEW_PROJECT }),
};
