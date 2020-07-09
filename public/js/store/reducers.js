
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
            [id]: { path: '-', },
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

    case actions.NEW_PROJECT:
      return { 
        ...initialState,
        directories: {
          allIds: [],
          byId: {},
        },
      };

    default:
      return state ? state : initialState;
  }
}
