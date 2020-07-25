import { persist } from './store/store.js';
import { setup as setupAudio } from './audio/audio.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupDirectories } from './view/directories.js';
import { setup as setupSettings } from './view/settings.js';

async function main() {
  setupAudio();
  setupControls();
  setupDirectories();
  setupSettings();
  persist();
}

main();
