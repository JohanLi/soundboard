import { Reducer } from 'redux';

import {
  CHANGE_SECTION,
  LOAD_SOUNDBOARD,
  LOADED_OUTPUT_DEVICES,
  CHANGE_OUTPUT_DEVICE,
  SHOW_PHRASE_DROPDOWN,
  HIDE_PHRASE_DROPDOWN,
  RENAME_PHRASE,
  REMOVE_PHRASE,
} from './action';
import { IState, ISoundboards, IPhrases } from './types';

const initialState: IState = {
  loading: true,
  soundboards: {},
  activeSoundboard: null,
  sections: {},
  activeSection: null,
  phrases: {},
  phraseDropdown: {
    active: false,
    phraseId: null,
    x: null,
    y: null,
  },
  devices: [],
  activeDevice: 'default',
};

const reducer: Reducer<IState> = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_SOUNDBOARD: {
      const { name, manifests } = payload;
      
      const soundboards: ISoundboards = {};

      Object.keys(manifests).forEach((soundboard) => {
        soundboards[soundboard] = {
          name: manifests[soundboard].name,
        };
      });

      let activeSoundboard = Object.keys(soundboards)[0];

      if (name) {
        activeSoundboard = name;
      }

      const sections = manifests[activeSoundboard].sections;
      const activeSection = Object.keys(sections)[0];

      const phrases: IPhrases = {};

      Object.keys(manifests[activeSoundboard].phrases).forEach((phrase) => {
        const audioElement = document.createElement('audio');
        audioElement.src = `soundboards/${activeSoundboard}/files/${phrase}`;

        phrases[phrase] = {
          id: phrase,
          name: manifests[activeSoundboard].phrases[phrase].name,
          audioElement,
        };
      });

      return {
        ...state,
        loading: false,
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
    case SHOW_PHRASE_DROPDOWN: {
      const { phraseId, x, y } = payload;

      return {
        ...state,
        phraseDropdown: {
          active: true,
          phraseId,
          x,
          y,
        },
      };
    }
    case HIDE_PHRASE_DROPDOWN: {
      return {
        ...state,
        phraseDropdown: {
          active: false,
          phraseId: null,
          x: null,
          y: null,
        },
      };
    }
    case RENAME_PHRASE: {
      const newPhrases = Object.assign({}, state.phrases);
      newPhrases[payload.phraseId].name = payload.name;

      return {
        ...state,
        phrases: newPhrases,
      };
    }
    case REMOVE_PHRASE: {
      const { phraseId } = state.phraseDropdown;
      const newSections = Object.assign({}, state.sections);

      Object.keys(newSections).forEach((sectionId) => {
        newSections[sectionId].phrases = newSections[sectionId].phrases.filter((id) => id !== phraseId);
      });

      const newPhrases = Object.assign({}, state.phrases);
      delete newPhrases[phraseId];

      return {
        ...state,
        sections: newSections,
        phrases: newPhrases,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
