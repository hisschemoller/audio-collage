
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
 * [source]->[pan]->[gain]->[destination]
 *               +->[gain]->[convolver]
 * @param {Object} ctx AudioContext.
 * @param {Object} convolver Impulse response convolver reverb.
 */
export function setup(ctx, convolver) {
	for (let i = 0; i < numVoices; i++) {
		const convolverSendGain = ctx.createGain();
		convolverSendGain.connect(convolver);

		const gain = ctx.createGain();
		gain.connect(ctx.destination);

		const pan = ctx.createStereoPanner();
		pan.connect(gain);

		voices.push({
			convolverSendGain,
			index: i,
			isPlaying: false,
			gain,
			pan,
			source: null,
			timerId: null,
		});
	}
}
