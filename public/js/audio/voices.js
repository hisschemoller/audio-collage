
const numVoices = 64;
const voices = [];
let voiceIndex = 0;

/**
 * Allocate a voice to play a sound.
 * @returns {Object} A voice object.
 */
export function allocVoice() {
  const voice = voices[voiceIndex];
  voiceIndex = ++voiceIndex % numVoices;

	if (voice.isPlaying) {
		freeVoice(voice);
	}
	
  return voice;
}

/**
 * 
 * @param {*} voice 
 */
export function freeVoice(voice) {
  if (voice.timerId) {
		clearTimeout(voice.timerId);
	}
	voice.timerId = null;
	voice.isPlaying = false;
}

export function getVoices() {
	return voices;
}

/**
 * Create the bank of reusable voice objects.
 * @param {Object} ctx AudioContext.
 */
export function setup(ctx) {
	for (let i = 0; i < numVoices; i++) {
		const gain = ctx.createGain();
		gain.connect(ctx.destination);

		voices.push({
			index: i,
			isPlaying: false,
			gain,
			source: null,
			timerId: null,
		});
	}
}
