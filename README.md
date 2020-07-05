# audio-collage

Generative audio collages with random samples.

An app that loads random audio files from selected locations on the harddrive. An audio collage is created based on rules and randomness. The idea came to me when I listened to the guitar music that accompanied a slide show of artworks at an exhibition at Arti et Amicitiae in Amsterdam. There is a type of 'abstract' music that is very typically used in art documentaries and presentations. It's very minimal and almost seems random or 'abstract'. Just sparse notes that don't form real melodies that can be remembered. It's background music, but it seems arty. Probably it is indeed serious music that is taken from a CD. In the case of this exhibition it were guitar notes.

It seemed to me that this type of music can very well be generated with some samples - of single guitar notes for example - and a set of rules for playing them.

A more interesting option - that might even be useful - is to select the samples randomly from folders on the computer of a music maker that has built his own collection of preferred samples over the years. And add the option to save the generated audio collage as a WAV file for later use.

Options:

- Set the tempo in BPM.
- Set multiple folders to choose the samples from.
  - Have an option to disable a folder, to quickly change the available sources.
- Set minimum and maximum number of samples to use in a single audio collage.
- Set the amount of tracks to generate.
  - If less samples that tracks are set, samples will be reused by multiple tracks.
- Treat long audio samples different than short ones (that are probably one-shot or percussive).
- Make use of stereo panning.
- Loop parts of samples, play reverse.
- Have a collection of re-usable patterns, rhythmic and pitched.
- Randomly add effects like reverb and delay.

## Practical implementation

- It will be a Node app because it needs to access folder's on the user's computer. 
- It can be packaged with NW or Electron for distribution.
- User settings are stored in localstorage.
