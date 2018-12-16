import { Dispatch } from 'redux';
import { remote } from 'electron';
import { MouseEvent, KeyboardEvent } from 'react';

import { IState } from './types';

const remoteWindow = remote.getCurrentWindow();

export const LOAD_SOUNDBOARD = 'LOAD_SOUNDBOARD';
export const CHANGE_SECTION = 'CHANGE_SECTION';
export const LOADED_OUTPUT_DEVICES = 'LOADED_OUTPUT_DEVICES';
export const CHANGE_OUTPUT_DEVICE = 'CHANGE_OUTPUT_DEVICE';

export const loadSoundboard = (name: string) => {
  return {
    type: LOAD_SOUNDBOARD,
    payload: name,
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
