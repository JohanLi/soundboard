import { Dispatch } from 'redux';
import { State, Phrase } from '../types';

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
  return (dispatch: Dispatch, getState: () => State) => {
    const { sections } = getState();

    Object.keys(sections).forEach((section) => {
      sections[section].phrases.forEach((phrase) => {
        phrase.audioElement.pause();
        phrase.audioElement.currentTime = 0;
      })
    });
  }
};

export const loadOutputDevices = () => {
  return async (dispatch: Dispatch) => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    dispatch({
      type: LOADED_OUTPUT_DEVICES,
      payload: devices
        .filter(device => device.kind === 'audiooutput')
        .map(device => ({
          id: device.deviceId,
          label: device.label,
        })),
    });
  };
};

export const changeOutputDevice = (id: string) => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { sections } = getState();
    const phrases: Promise<undefined>[] = [];

    Object.keys(sections).forEach((section) => {
      sections[section].phrases.forEach((phrase: Phrase) => {
        phrases.push(phrase.audioElement.setSinkId(id));
      });
    });

    try {
      await Promise.all(phrases);
    } catch(e) {}

    dispatch({
      type: CHANGE_OUTPUT_DEVICE,
      payload: id,
    });
  };
};
