export const LOAD_SOUNDBOARD = 'LOAD_SOUNDBOARD';
export const CHANGE_SECTION = 'CHANGE_SECTION';
export const LOADED_OUTPUT_DEVICES = 'LOADED_OUTPUT_DEVICES';
export const CHANGE_OUTPUT_DEVICE = 'CHANGE_OUTPUT_DEVICE';

export const loadSoundboard = name => {
  return (dispatch) => {
    if (name) {
      dispatch(stopAllSounds());
    }

    dispatch({
      type: LOAD_SOUNDBOARD,
      payload: name,
    });
  };
};

export const changeSection = section => {
  return {
    type: CHANGE_SECTION,
    payload: section,
  };
};

export const stopAllSounds = () => {
  return (dispatch, getState) => {
    const { sections } = getState();

    Object.keys(sections).forEach((section) => {
      sections[section].phrases.forEach((phrase) => {
        phrase.audioElement.pause();
        phrase.audioElement.currentTime = 0;
      })
    });
  };
};

export const loadOutputDevices = () => {
  return async (dispatch) => {
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

export const changeOutputDevice = id => {
  return async (dispatch, getState) => {
    const { sections } = getState();
    const phrases = [];

    Object.keys(sections).forEach((section) => {
      sections[section].phrases.forEach((phrase) => {
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
