import { Reducer } from 'redux';

import { getMetadata } from '../helpers/metadata';

import {
  CHANGE_SECTION,
  LOAD_SOUNDBOARD,
  LOADED_OUTPUT_DEVICES,
  CHANGE_OUTPUT_DEVICE,
} from '../actions';

interface State {
  soundboards: Soundboard;
  activeSoundboard: string;
  name: string;
  sections: {
    [key: string]: {
      name: string;
      phrases: Phrase[];
    };
  };
  activeSection: string;
  devices: Device[];
  activeDevice: string;
}

interface Soundboard {
  [key: string]: {
    name: string;
  };
}

interface Phrase {
  name: string;
  audioElement: HTMLAudioElement;
}

interface Device {
  id: string;
  label: string;
}

const initialState: State = {
  soundboards: {},
  activeSoundboard: null,
  name: null,
  sections: {},
  activeSection: null,
  devices: [],
  activeDevice: 'default',
};

const reducer: Reducer<State> = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_SOUNDBOARD: {
      const newState = Object.assign({}, state);
      const metadata = getMetadata();

      const soundboards: Soundboard = {};

      Object.keys(metadata).forEach((soundboard) => {
        soundboards[soundboard] = {
          name: metadata[soundboard].name,
        };
      });

      newState.soundboards = soundboards;

      if (payload) {
        if (payload === newState.activeSoundboard) {
          return state;
        }

        newState.activeSoundboard = payload;
        newState.sections = {};
      } else {
        newState.activeSoundboard = Object.keys(newState.soundboards)[0];
      }

      newState.name = metadata[newState.activeSoundboard].name;

      Object.keys(metadata[newState.activeSoundboard].sections).forEach((section) => {
        newState.sections[section] = {
          name: section,
          phrases: metadata[newState.activeSoundboard].sections[section].map((phrase) => {
            const audioElement = document.createElement('audio');
            audioElement.src = `soundboards/${newState.activeSoundboard}/files/${phrase.file}`;

            return {
              name: phrase.name,
              audioElement,
            };
          }),
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
    case LOADED_OUTPUT_DEVICES: {
      return {
        ...state,
        devices: payload,
      }
    }
    case CHANGE_OUTPUT_DEVICE: {
      return {
        ...state,
        activeDevice: payload,
      }
    }
    default: {
      return state;
    }
  }
};

export default reducer;
