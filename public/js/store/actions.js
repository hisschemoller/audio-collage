import { createUUID } from '../system/utils.js';
import { generateScore } from './actions-generate.js';

const ACTION = 'ACTION';
const DIRECTORY_ADD = 'DIRECTORY_ADD';
const DIRECTORY_PATH_CHANGE = 'DIRECTORY_PATH_CHANGE';
const DIRECTORY_REMOVE = 'DIRECTORY_REMOVE';
const DIRECTORY_TOGGLE_ENABLE = 'DIRECTORY_TOGGLE_ENABLE';
const GENERATE = 'GENERATE';
const NEW_PROJECT = 'NEW_PROJECT';
const SET_PROJECT = 'SET_PROJECT';
const SET_TRANSPORT = 'SET_TRANSPORT';

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

  GENERATE,
  generate: () => {
    return async (dispatch, getState, getActions) => {
      const { settings } = getState();
      const { numSamples } = settings;
      const url = `/json?type=sound&amount=${numSamples}`
      await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer'
      })
      .then(response => response.json())
      .then(data => {
        data.forEach(sound => sound.id = createUUID());
        const score = generateScore(getState(), data);
        dispatch({ type: GENERATE, data, score });
      });
      // .catch((error) => {
      //   console.error('Fetch sound error:', error);
      // });
    };
  },

  NEW_PROJECT,
  newProject: () => ({ type: NEW_PROJECT }),

  projectExport: () => {
    return (dispatch, getState) => {
      let jsonString = JSON.stringify(getState()),
      blob = new Blob([ jsonString ], { type: 'application/json' }),
      a = document.createElement('a');
      a.download = 'audiocollage.json';
      a.href = URL.createObjectURL(blob);
      a.click();
    }
  },

  projectImport: (file) => {
    return (dispatch, getState, getActions) => {
      let fileReader = new FileReader();

      // closure to capture the file information
      fileReader.onload = (function(f) {
        return function(e) {
          try {
            const data = JSON.parse(e.target.result);
            if (data) {
              dispatch(getActions().setProject(data));
            } else {
              throw new Error('No data found in imported file.');
            }
          } catch(errorMessage) {
            showDialog({
              header: 'Error importing file', 
              body: `An error occurred while importing the file. ${errorMessage}`,
              resolve: 'Close',
            });
          }
        };
      })(file);

      fileReader.readAsText(file);
    }
  },
  
  SET_PROJECT,
  setProject: state => ({ type: SET_PROJECT, state }),

  SET_TRANSPORT,
  setTransport: command => ({ type: SET_TRANSPORT, command }),
};
