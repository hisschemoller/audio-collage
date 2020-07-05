import { dispatch, getActions, getState, persist } from './store/store.js';
import { setup as setupControls } from './view/controls.js';

async function main() {
  setupControls();
  persist();
}

main();
