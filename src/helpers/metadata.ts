const { lstatSync, readdirSync, readFileSync } = require('fs');
const { join } = require('path');
import { remote } from 'electron';

interface Metadata {
  [key: string]: {
    name: string;
    sections: {
      [key: string]: Phrase[];
    };
  };
}

interface Phrase {
  name: string;
  file: string;
}

export const getMetadata = () => {
  const path = remote.app.getAppPath() + '/public/soundboards';

  const directories = readdirSync(path, 'utf8')
    .filter((directory: string) => {
      const absolutePath = join(path, directory);
      return lstatSync(absolutePath).isDirectory();
    });

  const metadata: Metadata = {};
  directories.forEach((directory: string) => {
    const absolutePath = join(path, directory);
    metadata[directory] = JSON.parse(readFileSync(`${absolutePath}/metadata.json`, 'utf8'));
  });

  return metadata;
};
