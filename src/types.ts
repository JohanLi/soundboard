export interface IState {
  soundboards: ISoundboards;
  activeSoundboard: string;
  name: string;
  sections: ISections;
  activeSection: string;
  devices: IDevice[];
  activeDevice: string;
}

export interface ISoundboards {
  [key: string]: {
    name: string;
  };
}

export interface ISections {
  [key: string]: {
    name: string;
    phrases: IPhrase[];
  };
}

export interface IPhrase {
  name: string;
  audioElement?: HTMLAudioElement;
}

export interface IDevice {
  id: string;
  label: string;
}
