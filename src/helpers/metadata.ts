import { lstatSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { SOUNDBOARDS_PATH } from './constants';

interface IMetadata {
  [key: string]: {
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
  };
}

export const getMetadata = () => {
  const directories = readdirSync(SOUNDBOARDS_PATH, 'utf8')
    .filter((directory: string) => {
      const absolutePath = join(SOUNDBOARDS_PATH, directory);
      return lstatSync(absolutePath).isDirectory();
    });

  const metadata: IMetadata = {};
  directories.forEach((directory: string) => {
    const metadataPath = join(SOUNDBOARDS_PATH, directory, 'metadata.json');
    metadata[directory] = JSON.parse(readFileSync(metadataPath, 'utf8'));
  });

  return metadata;
};
