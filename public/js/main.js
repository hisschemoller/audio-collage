import { persist } from './store/store.js';
import { setup as setupAudio, initAudio } from './audio/audio.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupDirectories } from './view/directories.js';
import { setup as setupInfo } from './view/info.js';
import { setup as setupSettings } from './view/settings.js';
import { showDialog } from './view/dialog.js';

async function main() {
  setupAudio();
  setupControls();
  setupDirectories();
  setupInfo();
  setupSettings();

  showDialog({
    header: 'Header', 
    body: 'Body',
    resolve: 'Ok',
    resolveCb: () => {
      initAudio();
      persist();
    },
  });
}

main();
