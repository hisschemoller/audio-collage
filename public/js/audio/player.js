import { allocVoice, freeVoice } from './voices.js';

/**
 * Sample playback.
 */
export default function createSamplePlayer(data) {
  const { buffer, ctx, loopDurationInSecs, pattern, sampleDuration, sampleStartOffset, } = data;
  // const voices = [];

  const createVoice = function(when) {
    const voice = allocVoice();

    voice.source = ctx.createBufferSource();
    voice.source.buffer = buffer;
    voice.source.connect(voice.gain);

    // gain = ctx.createGain();

    // source.connect(gain).connect(ctx.destination);

    voice.gain.gain.setValueAtTime(0.0001, when);
    voice.gain.gain.exponentialRampToValueAtTime(1, when + 0.004);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, when + sampleDuration);

    voice.source.onended = function(e) {
      voice.source.disconnect();
      freeVoice(voice);
    };

    voice.source.start(when, sampleStartOffset);
    voice.source.stop(when + sampleDuration);

    // voices.push({source, gain});
  };

  /**
   * Schedule all notes in a pattern to play. At pattern / loop start.
   * @param {Number} when Pattern start time in seconds.
   * @param {Number} index Pattern iteration index.
   */
  const play = function(when, index) {
    console.log(when);
    pattern.forEach(note => {
      createVoice(when + (loopDurationInSecs * note.time));
    });
  };

  /**
   * Stop all scheduled patterns.
   */
  const stop = () => {
    voices.forEach(voice => {
      voice.source.stop();
      voice.gain.disconnect();
      voice.gain = null;
    });
    voices.length = 0;
  };

  return {
    play,
    stop,
  };
}