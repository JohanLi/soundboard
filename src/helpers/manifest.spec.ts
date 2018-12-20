jest.mock('./constants', () => ({
  SOUNDBOARDS_PATH: '\\path\\to\\soundboards',
}));

jest.mock('fs', () => ({
  lstatSync: (path: string) => ({
    isDirectory: () => path !== '\\path\\to\\soundboards\\not-a-directory',
  }),
  readdirSync: () => ['arnold-schwarzenegger', 'donald-trump', 'not-a-directory'],
  readFileSync: (path: string) => {
    if (path === '\\path\\to\\soundboards\\arnold-schwarzenegger\\manifest.json') {
      return '{"name":"Arnold Schwarzenegger"}';
    }

    return '{"name":"Donald Trump"}';
  },
  writeFileSync: jest.fn(),
}));

import { getAll, save } from './manifest';
import { writeFileSync } from 'fs';

test('able to read manifests of soundboards', () => {
  const manifests = {
    'arnold-schwarzenegger': {
      name: 'Arnold Schwarzenegger',
    },
    'donald-trump': {
      name: 'Donald Trump',
    },
  };

  expect(getAll()).toEqual(manifests);
});

test('able to overwrite the manifest of a soundboard', () => {
  const audioElement = document.createElement('audio');

  const state = {
    soundboards: {
      'arnold-schwarzenegger': {
        name: 'Arnold Schwarzenegger',
      },
      'donald-trump': {
        name: 'Donald Trump',
      },
    },
    activeSoundboard: 'donald-trump',
    sections: {
      pleasantries: {
       name: 'Pleasantries',
       phrases: [
         'hi.mp3',
         'good-morning.mp3',
       ],
      },
    },
    phrases: {
      'hi.mp3': {
        id: 'hi.mp3',
        name: 'Hi',
        audioElement,
      },
      'good-morning.mp3': {
        id: 'good-morning.mp3',
        name: 'Good Morning',
        audioElement,
      },
    },
  };

  const manifest = JSON.stringify(
    {
      name: 'Donald Trump',
      sections: {
        pleasantries: {
          name: 'Pleasantries',
          phrases: [
            'hi.mp3',
            'good-morning.mp3',
          ],
        },
      },
      phrases: {
        'hi.mp3': {
          name: 'Hi',
          file: 'hi.mp3',
        },
        'good-morning.mp3': {
          name: 'Good Morning',
          file: 'good-morning.mp3',
        },
      },
    },
    null,
    2,
  );

  save(state);
  expect(writeFileSync).toHaveBeenCalledWith(
    '\\path\\to\\soundboards\\donald-trump\\manifest.json',
    manifest,
    'utf-8',
  );
});
