import { persist } from './store/store.js';
import { setup as setupAudio } from './audio/audio.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupDirectories } from './view/directories.js';

async function main() {
  setupAudio();
  setupControls();
  setupDirectories();
  persist();
}

main();
