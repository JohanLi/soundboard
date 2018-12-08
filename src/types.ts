export interface State {
  sections: {
    [key: string]: {
      name: string;
      phrases: Phrase[];
    }
  }
}

export interface Phrase {
  name: string;
  audioElement: HTMLAudioElement;
}
