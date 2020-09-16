import { HAT, KICK, SNARE } from '../util/constants.js';

const drums = { [HAT]: false, [KICK]: false, [SNARE]: false, };

export function getDrums() {
  return drums;
};

/**
 * Store values that can be calculated based on combined state values.
 * @param {Object} state 
 * @param {Object} action 
 * @param {Object} actions 
 */
export default function memoize(state, action = {}, actions) {
  switch (action.type) {
    case actions.DIRECTORY_ADD:
    case actions.DIRECTORY_REMOVE:
    case actions.DIRECTORY_TOGGLE_ENABLE:
    case actions.NEW_PROJECT:
    case actions.SET_PROJECT:
    setDrums(state);
    default:
  }
}

/**
 * 
 * @param {*} state 
 */
function setDrums(state) {
  const { directories } = state;
  Object.keys(drums).forEach(key => {
    drums[key] = directories.allIds.some(dirId => directories.byId[dirId].sound === key);
  });
}
