
const initialState = {
  directories: {
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
              path: '-',
            },
          },
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

    case actions.NEW_PROJECT:
      return { 
        ...initialState,
        directories: {
          allIds: [],
          byId: {},
        },
      };

    case actions.SET_PROJECT:
      return { ...state, ...action.state };

    default:
      return state ? state : initialState;
  }
}
