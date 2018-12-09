jest.mock('./constants', () => ({
  SOUNDBOARDS_PATH: '\\path\\to\\soundboards',
}));

jest.mock('fs', () => ({
  lstatSync: (path: string) => ({
    isDirectory: () => path !== '\\path\\to\\soundboards\\not-a-directory',
  }),
  readdirSync: () => ['arnold-schwarzenegger', 'donald-trump', 'not-a-directory'],
  readFileSync: (path: string) => {
    if (path === '\\path\\to\\soundboards\\arnold-schwarzenegger\\metadata.json') {
      return '{"name":"Arnold Schwarzenegger"}';
    }

    return '{"name":"Donald Trump"}';
  },
}));

import { getMetadata } from './metadata';

test('able to read metadata for soundboards', () => {
  const metadata = {
    'arnold-schwarzenegger': {
      name: 'Arnold Schwarzenegger',
    },
    'donald-trump': {
      name: 'Donald Trump',
    },
  };

  expect(getMetadata()).toEqual(metadata);
});
