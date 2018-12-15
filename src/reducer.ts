import { Reducer } from 'redux';

import {
  CHANGE_SECTION,
  LOAD_SOUNDBOARD,
  LOADED_OUTPUT_DEVICES,
  CHANGE_OUTPUT_DEVICE,
} from './action';
import { IState, ISoundboards, IPhrases } from './types';
import { getMetadata } from './helpers/metadata';

const initialState: IState = {
  soundboards: {},
  activeSoundboard: null,
  sections: {},
  activeSection: null,
  phrases: {},
  devices: [],
  activeDevice: 'default',
};

const reducer: Reducer<IState> = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_SOUNDBOARD: {
      const metadata = getMetadata();
      const soundboards: ISoundboards = {};

      Object.keys(metadata).forEach((soundboard) => {
        soundboards[soundboard] = {
          name: metadata[soundboard].name,
        };
      });

      let activeSoundboard = Object.keys(soundboards)[0];

      if (payload) {
        activeSoundboard = payload;
      }

      const sections = metadata[activeSoundboard].sections;
      const activeSection = Object.keys(sections)[0];

      const phrases: IPhrases = {};

      Object.keys(metadata[activeSoundboard].phrases).forEach((phrase) => {
        const audioElement = document.createElement('audio');
        audioElement.src = `soundboards/${activeSoundboard}/files/${phrase}`;

        phrases[phrase] = {
          name: metadata[activeSoundboard].phrases[phrase].name,
          audioElement,
        };
      });

      return {
        ...state,
        soundboards,
        activeSoundboard,
        sections,
        activeSection,
        phrases,
      };
    }
    case CHANGE_SECTION: {
      return {
        ...state,
        activeSection: payload,
      };
    }
    case LOADED_OUTPUT_DEVICES: {
      return {
        ...state,
        devices: payload,
      };
    }
    case CHANGE_OUTPUT_DEVICE: {
      return {
        ...state,
        activeDevice: payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
