import { createUUID } from '../util/utils.js';
import { generateScore } from './actions-generate.js';
import { generateGridsScore } from './actions-generate-grids.js';
import { getDrums } from './selectors.js';

const ADVANCE_TIME = 'ADVANCE_TIME';
const BUFFERS_LOADED = 'BUFFERS_LOADED';
const DIRECTORY_ADD = 'DIRECTORY_ADD';
const DIRECTORY_PATH_CHANGE = 'DIRECTORY_PATH_CHANGE';
const DIRECTORY_REMOVE = 'DIRECTORY_REMOVE';
const DIRECTORY_TOGGLE_ENABLE = 'DIRECTORY_TOGGLE_ENABLE';
const GENERATE = 'GENERATE';
const NEW_PROJECT = 'NEW_PROJECT';
const SET_PROJECT = 'SET_PROJECT';
const SET_SETTING = 'SET_SETTING';
const SET_TRANSPORT = 'SET_TRANSPORT';

// actions
export default {

  ADVANCE_TIME,
  advanceTime: (when, index) => ({ type: ADVANCE_TIME, when, index }),

  BUFFERS_LOADED,
  buffersLoaded: () => ({ type: BUFFERS_LOADED }),

  DIRECTORY_ADD,
  directoryAdd: type => ({ type: DIRECTORY_ADD, id: createUUID(), type }),

  DIRECTORY_PATH_CHANGE,
  directoryPathChange: (id, path) => ({ type: DIRECTORY_PATH_CHANGE, id, path }),

  DIRECTORY_REMOVE,
  directoryRemove: id => ({ type: DIRECTORY_REMOVE, id }),

  DIRECTORY_TOGGLE_ENABLE,
  directoryToggleEnable: id => ({ type: DIRECTORY_TOGGLE_ENABLE, id }),

  GENERATE,
  generate: () => {
    return async (dispatch, getState, getActions) => {
      const { directories, settings } = getState();
      const { numSamples } = settings;
      const { hat, kick, snare } = getDrums();
      const url = `/json?type=sound&amount=${numSamples}&hat=${hat}&kick=${kick}&snare=${snare}`
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
      .then(sampleData => {
        sampleData.forEach(sound => sound.id = createUUID());
        const drums = generateGridsScore(getState(), sampleData);
        const samples = generateScore(getState(), sampleData);
        const score = [ ...samples.score ];
        const tracks = {
          allIds: [ ...drums.tracks.allIds, ...samples.tracks.allIds ],
          byId: { ...drums.tracks.byId, ...samples.tracks.byId },
        };
        dispatch({ type: GENERATE, sampleData, score, tracks });
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

  projectImport: file => {
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
  
  SET_SETTING,
  setSetting: (setting, value) => ({ type: SET_SETTING, setting, value }),

  SET_TRANSPORT,
  setTransport: command => ({ type: SET_TRANSPORT, command }),
};
