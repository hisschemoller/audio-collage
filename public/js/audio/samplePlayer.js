/**
 * Sample playback.
 */
export default function createSamplePlayer(data) {
  const { buffer, ctx, loopDurationInSecs, pattern, } = data;
  const voices = [];

  const createVoice = function(when, duration) {
    let source, gain;

    source = ctx.createBufferSource();
    source.buffer = buffer;
    gain = ctx.createGain();

    source.connect(gain).connect(ctx.destination);

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(1, when + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    source.onended = function(e) {
      gain.disconnect();
      gain = null;
    };

    source.start(when);
    source.stop(when + duration);

    voices.push({source, gain});
  };

  const play = function(when, index) {
    pattern.forEach(note => {
      createVoice(when + (loopDurationInSecs * note.time), 0.4);
    });
  };

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