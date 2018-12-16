export interface IState {
  loading: boolean;
  soundboards: ISoundboards;
  activeSoundboard: string;
  sections: ISections;
  activeSection: string;
  phrases: IPhrases;
  devices: IDevice[];
  activeDevice: string;
}

export interface ISoundboards {
  [key: string]: ISoundboard;
}

export interface ISoundboard {
  name: string;
}

export interface ISections {
  [key: string]: ISection;
}

export interface ISection {
  name: string;
  phrases: string[];
}

export interface IPhrases {
  [key: string]: IPhrase;
}

export interface IPhrase {
  id: string;
  name: string;
  audioElement: HTMLAudioElement;
  match?: {
    type: string;
    highlight: number[];
  };
}

export interface IDevice {
  id: string;
  label: string;
}
