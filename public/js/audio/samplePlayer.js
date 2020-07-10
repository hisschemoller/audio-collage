/**
 * Sample playback.
 */
export default function createSamplePlayer(data) {
  const { buffer, ctx, loopDurationInSecs, pattern, } = data;

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
  };

  const play = function(when, index) {
    pattern.forEach(note => {
      createVoice(when + (loopDurationInSecs * note.time), 0.4);
    });
  };

  return {
    play,
  };
}