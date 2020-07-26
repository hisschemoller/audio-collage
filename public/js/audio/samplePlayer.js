/**
 * Sample playback.
 */
export default function createSamplePlayer(data) {
  const { buffer, ctx, loopDurationInSecs, pattern, sampleDuration, sampleStartOffset, } = data;
  const voices = [];

  const createVoice = function(when) {
    let source, gain;

    source = ctx.createBufferSource();
    source.buffer = buffer;
    gain = ctx.createGain();

    source.connect(gain).connect(ctx.destination);

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(1, when + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + sampleDuration);

    source.onended = function(e) {
      gain.disconnect();
      gain = null;
    };

    source.start(when, sampleStartOffset);
    source.stop(when + sampleDuration);

    voices.push({source, gain});
  };

  const play = function(when, index) {
    console.log(when);
    pattern.forEach(note => {
      createVoice(when + (loopDurationInSecs * note.time));
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