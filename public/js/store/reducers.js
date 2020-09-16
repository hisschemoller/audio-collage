
const initialState = {
  directories: {
    allIds: [],
    byId: {},
  },
  settings: {
    loopDurationInSecs: 2,
    numSamples: 4,
    numTracks: 2,
  },
  sounds: {
    allIds: [],
    byId: {},
  },
  tracks: {
    allIds: [],
    byId: {},
  },
  transport: 'stop',
};

/**
 * 
 * @param {Object} state 
 * @param {Object} action 
 * @param {String} action.type
 */
export default function reduce(state = initialState, action, actions = {}) {
  switch (action.type) {

    case actions.DIRECTORY_ADD: {
      const { id, type } = action;
      return {
        ...state,
        directories: {
          allIds: [ ...state.directories.allIds, id, ],
          byId: { 
            ...state.directories.byId,
            [id]: {
              isEnabled: true,
              path: '',
              type,
            },
          },
        },
      };
    }

    case actions.DIRECTORY_PATH_CHANGE: {
      const { id, path } = action;
      return {
        ...state,
        directories: {
          allIds: [ ...state.directories.allIds ],
          byId: state.directories.allIds.reduce((accumulator, dirId) => {
            if (dirId === id) {
              return { ...accumulator, [dirId]: { 
                ...state.directories.byId[dirId],
                path,
              } };
            }
            return { ...accumulator, [dirId]: state.directories.byId[dirId] };
          }, {}),
        },
      };
    }

    case actions.DIRECTORY_REMOVE: {
      const { id } = action;
      return {
        ...state,
        directories: {
          allIds: state.directories.allIds.reduce((accumulator, dirId) => {
            if (dirId === id) {
              return [ ...accumulator ];
            }
            return [ ...accumulator, dirId ];
          }, []),
          byId: state.directories.allIds.reduce((accumulator, dirId) => {
            if (dirId === id) {
              return { ...accumulator };
            }
            return { ...accumulator, [dirId]: state.directories.byId[dirId] };
          }, {}),
        },
      }
    }

    case actions.DIRECTORY_TOGGLE_ENABLE: {
      const { id } = action;
      return {
        ...state,
        directories: {
          allIds: [ ...state.directories.allIds ],
          byId: state.directories.allIds.reduce((accumulator, dirId) => {
            if (dirId === id) {
              return { ...accumulator, [dirId]: { 
                ...state.directories.byId[dirId],
                isEnabled: !state.directories.byId[dirId].isEnabled,
              } };
            }
            return { ...accumulator, [dirId]: state.directories.byId[dirId] };
          }, {}),
        },
      };
    }

    case actions.GENERATE: {
      const { sampleData, score, tracks } = action;
      return {
        ...state,
        score,
        sounds: {
          allIds: sampleData.reduce((accumulator, sound) => [ ...accumulator, sound.id ], []),
          byId: sampleData.reduce((accumulator, sound) => ({ ...accumulator, [sound.id]: { ...sound }}), {}),
        },
        tracks,
        transport: 'play',
      }
    }

    case actions.NEW_PROJECT:
      return { 
        ...initialState,
        directories: {
          allIds: [],
          byId: {},
        },
        settings: { ...initialState.settings },
        sounds: {
          allIds: [],
          byId: {},
        },
        tracks: {
          allIds: [],
          byId: {},
        }
      };

    case actions.SET_PROJECT:
      return { ...state, ...action.state };

    case actions.SET_SETTING: {
      const { setting, value } = action;
      return { 
        ...state, 
        settings: {
          ...state.settings,
          [setting]: value,
        }
      };
    }
		
    case actions.SET_TRANSPORT: {
      const { command } = action;
      const { transport } = state;
      return {
        ...state,
        transport: command === 'toggle' ? transport === 'play' ? 'pause' : 'play' : command,
      };
    }

    default:
      return state ? state : initialState;
  }
}
