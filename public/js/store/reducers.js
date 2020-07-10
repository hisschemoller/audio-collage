
const initialState = {
  directories: {
    allIds: [],
    byId: {},
  },
  isPlaying: false,
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
      const { id } = action;
      return {
        ...state,
        directories: {
          allIds: [ ...state.directories.allIds, id, ],
          byId: { 
            ...state.directories.byId,
            [id]: {
              isEnabled: true,
              path: '',
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
      const { data, score } = action;
      const { tracks } = score;
      return {
        ...state,
        sounds: {
          allIds: data.reduce((accumulator, sound) => [ ...accumulator, sound.id ], []),
          byId: data.reduce((accumulator, sound) => ({ ...accumulator, [sound.id]: {
            dir: sound.dir,
            file: sound.file,
          }}), {}),
        },
        tracks,
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

    default:
      return state ? state : initialState;
  }
}
