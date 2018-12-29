export interface IState {
  loading: boolean;
  soundboards: ISoundboards;
  activeSoundboard: string;
  sections: ISections;
  activeSection: string;
  phrases: IPhrases;
  phraseDropdown: IPhraseDropdown;
  devices: IDevice[];
  activeDevice: string;
  modal: IModal;
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

export interface IPhraseDropdown {
  active: boolean;
  phraseId: string;
  x: number;
  y: number;
}

export interface IFile {
  path: string;
  name: string;
}

export interface IDevice {
  id: string;
  label: string;
}

export interface IModal {
  type: ModalTypes;
  sectionId?: string;
  phraseId?: string;
}

export type ModalTypes = 'addSection' | 'renameSection' | 'renamePhrase';
