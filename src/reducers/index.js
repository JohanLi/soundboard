import { lstatSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { remote } from 'electron';

import { CHANGE_SECTION, STARTED_PLAYING, STOPPED_PLAYING, LOAD_SOUNDBOARD } from '../actions';

const metadata = {};
const getSoundboards = () => {
  const soundboardsPath = remote.app.getAppPath() + '/public/soundboards';
  const soundboards = readdirSync(soundboardsPath, 'utf8')
    .filter(file => {
      const absolutePath = join(soundboardsPath, file);
      return lstatSync(absolutePath).isDirectory();
    });

  soundboards.forEach((soundboard) => {
    const absolutePath = join(soundboardsPath, soundboard);
    metadata[soundboard] = JSON.parse(readFileSync(`${absolutePath}/metadata.json`, 'utf8'));
  });

  const s = {};

  soundboards.forEach(soundboard => {
    s[soundboard] = {
      name: metadata[soundboard].name,
    };
  });

  return s;
};

const initialState = {
  soundboards: {},
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

      if (payload) {
        if (payload === newState.activeSoundboard) {
          return state;
        }

        newState.activeSoundboard = payload;
        newState.sections = {};
      } else {
        newState.soundboards = getSoundboards();
        newState.activeSoundboard = Object.keys(newState.soundboards)[0];
      }

      newState.name = metadata[newState.activeSoundboard].name;

      Object.keys(metadata[newState.activeSoundboard].sections).forEach((section) => {
        newState.sections[section] = {
          name: section,
          phrases:  metadata[newState.activeSoundboard].sections[section].map((phrase) => ({
            name: phrase.name,
            src: `soundboards/${newState.activeSoundboard}/files/${phrase.file}`,
          })),
        }
      });

      newState.activeSection = Object.keys(metadata[newState.activeSoundboard].sections)[0];

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
