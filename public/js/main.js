import { persist } from './store/store.js';
import { setup as setupAudio } from './audio/audio.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupDirectories } from './view/directories.js';

async function main() {
  setupAudio();
  setupControls();
  setupDirectories();
  setupInfo();
  setupSettings();

  showDialog({
    header: 'Audio Collage', 
    body: 'Click Ok to initialise the audio engine.',
    resolve: 'Ok',
    resolveCb: () => {
      initAudio();
      persist();
    },
  });
}

main();
