import { lstatSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { CHANGE_SECTION, STARTED_PLAYING, STOPPED_PLAYING, LOAD_SOUNDBOARD } from '../actions';

const soundboardsPath = './public/soundboards';

const getSoundboards = () => readdirSync(soundboardsPath, 'utf8')
  .filter(file => {
    const absolutePath = join(soundboardsPath, file);
    return lstatSync(absolutePath).isDirectory();
  });

const getMetadata = soundboard => {
  const absolutePath = join(soundboardsPath, soundboard);
  return JSON.parse(readFileSync(`${absolutePath}/metadata.json`, 'utf8'));
};

const initialState = {
  soundboards: [],
  activeSoundboard: null,
  name: null,
  sections: {},
  activeSection: null,
  phrases: [],
  playing: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_SOUNDBOARD: {
      const newState = Object.assign({}, state);
      newState.soundboards = getSoundboards();
      newState.activeSoundboard = newState.soundboards[0];
      const metadata = getMetadata(newState.activeSoundboard);

      newState.name = metadata.name;

      Object.keys(metadata.sections).forEach((section) => {
        newState.sections[section] = {
          name: section,
          phrases:  metadata.sections[section].map((phrase) => ({
            name: phrase.name,
            src: `/soundboards/${newState.activeSoundboard}/files/${phrase.file}`,
          })),
        }
      });

      newState.activeSection = Object.keys(newState.sections)[0];

      return newState;
    }
    case CHANGE_SECTION: {
      const newState = Object.assign({}, state);
      newState.activeSection = payload;

      return newState;
    }
    case STARTED_PLAYING: {
      const newState = Object.assign({}, state);
      newState.playing.push(payload);

      return newState;
    }
    case STOPPED_PLAYING: {
      const newState = Object.assign({}, state);
      newState.playing = newState.playing.filter(audioElement => audioElement.current.getAttribute('src') !== payload);

      return newState;
    }
    default: {
      return state;
    }
  }
}
