import { persist } from './store/store.js';
import { setup as setupAudio, initAudio } from './audio/audio.js';
import { setup as setupBuffers } from './audio/buffers.js';
import { setup as setupPlayer } from './audio/player.js';
import { setup as setupGridsCyrene } from './grids-cyrene/grids-sequencer.js';
import { setup as setupGrids } from './grids/pattern-generator.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupDirectories } from './view/directories.js';
import { setup as setupInfo } from './view/info.js';
import { setup as setupSettings } from './view/settings.js';
import { showDialog } from './view/dialog.js';

async function main() {
  setupAudio();
  setupBuffers();
  setupControls();
  setupDirectories();
  setupGridsCyrene();
  setupGrids();
  setupInfo();
  setupPlayer();
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
