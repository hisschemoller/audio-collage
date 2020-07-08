import { dispatch, getActions, getState, persist } from './store/store.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupDirectories } from './view/directories.js';

async function main() {
  setupControls();
  setupDirectories();
  persist();
}

main();
