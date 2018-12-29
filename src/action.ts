import { Dispatch } from 'redux';
import { remote } from 'electron';
import { MouseEvent, KeyboardEvent, DragEvent } from 'react';

import { getAll, add, save } from './helpers/manifest';
import { IState, IFile, ModalTypes } from './types';

const remoteWindow = remote.getCurrentWindow();

export const LOAD_SOUNDBOARD = 'LOAD_SOUNDBOARD';
export const CHANGE_SECTION = 'CHANGE_SECTION';
export const LOADED_OUTPUT_DEVICES = 'LOADED_OUTPUT_DEVICES';
export const CHANGE_OUTPUT_DEVICE = 'CHANGE_OUTPUT_DEVICE';
export const SHOW_PHRASE_DROPDOWN = 'SHOW_PHRASE_DROPDOWN';
export const HIDE_PHRASE_DROPDOWN = 'HIDE_PHRASE_DROPDOWN';
export const RENAME_PHRASE = 'RENAME_PHRASE';
export const REMOVE_PHRASE = 'REMOVE_PHRASE';
export const ADD_PHRASES = 'ADD_PHRASES';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const ADD_SECTION = 'ADD_SECTION';

export const loadSoundboard = (name: string) => {
  return {
    type: LOAD_SOUNDBOARD,
    payload: {
      name,
      manifests: getAll(),
    },
  };
};

export const changeSection = (section: string) => {
  return {
    type: CHANGE_SECTION,
    payload: section,
  };
};

export const stopAllSounds = () => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const { phrases } = getState();

    Object.keys(phrases).forEach((phraseId) => {
      phrases[phraseId].audioElement.pause();
      phrases[phraseId].audioElement.currentTime = 0;
    });
  };
};

export const loadOutputDevices = () => {
  return async (dispatch: Dispatch) => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    dispatch({
      type: LOADED_OUTPUT_DEVICES,
      payload: devices
        .filter((device) => device.kind === 'audiooutput')
        .map((device) => ({
          id: device.deviceId,
          label: device.label,
        })),
    });
  };
};

export const changeOutputDevice = (id: string) => {
  return async (dispatch: Dispatch, getState: () => IState) => {
    const { phrases } = getState();
    const setSinkIds: Array<Promise<undefined>> = [];

    Object.keys(phrases).forEach((phraseId) => {
      setSinkIds.push(phrases[phraseId].audioElement.setSinkId(id));
    });

    try {
      await Promise.all(setSinkIds);
    } catch(e) {}

    dispatch({
      type: CHANGE_OUTPUT_DEVICE,
      payload: id,
    });
  };
};

export const play = (id: string, e: MouseEvent | KeyboardEvent) => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const { phrases } = getState();

    if (!phrases[id].audioElement.paused) {
      phrases[id].audioElement.pause();
      phrases[id].audioElement.currentTime = 0;
    } else {
      phrases[id].audioElement.play();
    }

    if (e.ctrlKey || e.metaKey) {
      remoteWindow.minimize();
    }
  };
};

export const showPhraseDropdown = (phraseId: string, e: MouseEvent) => {
  e.stopPropagation();

  return {
    type: SHOW_PHRASE_DROPDOWN,
    payload: {
      phraseId,
      x: e.clientX,
      y: e.clientY,
    },
  };
};

export const hidePhraseDropdown = () => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const { phraseDropdown } = getState();

    if (phraseDropdown.active) {
      dispatch({
        type: HIDE_PHRASE_DROPDOWN,
      });
    }
  };
};

export const renamePhrase = (phraseId: string, newName: string) => {
  return (dispatch: Dispatch, getState: () => IState) => {
    dispatch({
      type: RENAME_PHRASE,
      payload: {
        phraseId,
        newName,
      },
    });

    save(getState());
  };
};

export const removePhrase = () => {
  return (dispatch: Dispatch, getState: () => IState) => {
    dispatch({
      type: REMOVE_PHRASE,
    });

    save(getState());
  };
};

export const addPhrases = (e: DragEvent) => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const { activeSoundboard } = getState();

    if (!e.dataTransfer.items) {
      return;
    }

    const audioElement = document.createElement('audio');
    const files: IFile[] = [];

    for (const item of e.dataTransfer.items) {
      if (item.kind !== 'file') {
        continue;
      }

      const file = item.getAsFile();

      if (audioElement.canPlayType(file.type) !== 'probably') {
        continue;
      }

      files.push({
        path: file.path,
        name: file.name,
      });
    }

    if (files.length) {
      add(files, activeSoundboard);

      dispatch({
        type: ADD_PHRASES,
        payload: files,
      });

      save(getState());
    }
  };
};

export const openModal = (type: ModalTypes, sectionOrPhraseId?: string) => ({
  type: OPEN_MODAL,
  payload: {
    type,
    sectionOrPhraseId,
  },
});

export const closeModal = () => ({
  type: CLOSE_MODAL,
});

export const addSection = (name: string) => {
  return (dispatch: Dispatch, getState: () => IState) => {
    dispatch({
      type: ADD_SECTION,
      payload: name,
    });

    save(getState());
  };
};
