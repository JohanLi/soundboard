import { STARTED_PLAYING, STOPPED_PLAYING } from '../actions';

const phrases = [
  'Dont worry',
  'Good',
  'Good bye',
];

const phraseToFilename = phrase => phrase
  .toLowerCase()
  .replace('´', '')
  .replace(/\s/g, '-');

const sectionName = 'pleasantries';

const initialState = {
  phrases: phrases.map((phrase) => ({
    name: phrase,
    src: `/soundboard/arnold-schwarzenegger/${sectionName}/${phraseToFilename(phrase)}.mp3`,
  })),
  playing: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'STARTED_PLAYING': {
      const newState = Object.assign({}, state);
      newState.playing.push(payload);

      return newState;
    }

    case 'STOPPED_PLAYING': {
      const newState = Object.assign({}, state);
      newState.playing = newState.playing.filter(audioElement => audioElement.current.getAttribute('src') !== payload);

      return newState;
    }
    default: {
      return state;
    }
  }
}
