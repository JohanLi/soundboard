export const STARTED_PLAYING = 'STARTED_PLAYING';
export const STOPPED_PLAYING = 'STOPPED_PLAYING';

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
