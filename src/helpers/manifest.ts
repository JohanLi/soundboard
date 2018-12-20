import {default as fs, lstatSync, readdirSync, readFileSync, writeFileSync} from 'fs';
import { join } from 'path';

import { SOUNDBOARDS_PATH } from './constants';
import { ISoundboards, ISections, IPhrases, IFile } from '../types';

interface IManifests {
  [key: string]: ISoundboard;
}

interface ISoundboard {
  name: string;
  sections: {
    [key: string]: {
      name: string;
      phrases: string[];
    };
  };
  phrases: {
    [key: string]: {
      name: string;
      file: string;
    };
  };
}

interface IState {
  soundboards: ISoundboards;
  activeSoundboard: string;
  sections: ISections;
  phrases: IPhrases;
}

export const getAll = () => {
  const directories = readdirSync(SOUNDBOARDS_PATH, 'utf8')
    .filter((directory: string) => {
      const absolutePath = join(SOUNDBOARDS_PATH, directory);
      return lstatSync(absolutePath).isDirectory();
    });

  const manifests: IManifests = {};
  directories.forEach((directory: string) => {
    const manifestPath = join(SOUNDBOARDS_PATH, directory, 'manifest.json');
    manifests[directory] = JSON.parse(readFileSync(manifestPath, 'utf8'));
  });

  return manifests;
};

export const add = (files: IFile[], soundboard: string) => {
  files.forEach((file) => {
    fs.copyFileSync(file.path, join(SOUNDBOARDS_PATH, soundboard, 'files', file.name));
  });
};

export const save = (state: IState) => {
  const soundboard: ISoundboard = {
    name: state.soundboards[state.activeSoundboard].name,
    sections: state.sections,
    phrases: {},
  };

  Object.keys(state.phrases).forEach((phraseId) => {
    soundboard.phrases[phraseId] = {
      name: state.phrases[phraseId].name,
      file: state.phrases[phraseId].id,
    };
  });

  writeFileSync(
    join(SOUNDBOARDS_PATH, state.activeSoundboard, 'manifest.json'),
    JSON.stringify(soundboard, null, 2),
    'utf-8',
  );
};
