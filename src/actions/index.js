export const LOAD_SOUNDBOARD = 'LOAD_SOUNDBOARD';
export const CHANGE_SECTION = 'CHANGE_SECTION';
export const STARTED_PLAYING = 'STARTED_PLAYING';
export const STOPPED_PLAYING = 'STOPPED_PLAYING';

export const loadSoundboard = name => {
  return {
    type: LOAD_SOUNDBOARD,
    payload: name,
  };
};

export const changeSection = section => {
  return {
    type: CHANGE_SECTION,
    payload: section,
  };
};

export const startedPlaying = audioElement => {
  return {
    type: STARTED_PLAYING,
    payload: audioElement,
  };
};

export const stoppedPlaying = src => {
  return {
    type: STOPPED_PLAYING,
    payload: src,
  };
};
