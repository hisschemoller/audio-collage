import { persist } from './store/store.js';
import { setup as setupAudio, initAudio } from './audio/audio.js';
import { setup as setupBuffers } from './audio/buffers.js';
import { setup as setupPlayer } from './audio/player.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupPaths } from './view/paths.js';
import { setup as setupInfo } from './view/info.js';
import { setup as setupSettings } from './view/settings.js';
import { showDialog } from './view/dialog.js';

function main() {
  setupAudio();
  setupBuffers();
  setupControls();
  setupPaths();
  setupInfo();
  setupPlayer();
  setupSettings();

  showDialog({
    header: 'Audio Collage', 
    body: 'Click Ok to initialise the audio engine.',
    resolve: 'Ok',
    resolveCb: async () => {
      await initAudio();
      persist();
    },
  });
}

main();
