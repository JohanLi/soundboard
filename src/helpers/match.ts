import { IPhrase } from '../types';

export const wordStartsWith = (phrase: IPhrase, input: string) => {
  if (!phrase.name.toLowerCase().startsWith(input.toLowerCase())) {
    return phrase;
  }

  return {
    ...phrase,
    match: {
      type: 'wordStartsWith',
      highlight: Array.from({length: input.length}, (x, i) => i),
    },
  };
};

export const acronymStartsWith = (phrase: IPhrase, input: string) => {
  const words = phrase.name.toLowerCase().split(/\s/);
  const acronym = words.reduce((a, word) => a + word[0], '');

  if (!acronym.startsWith(input.toLowerCase())) {
    return phrase;
  }

  const highlight = [0];

  for (let i = 0; i < input.length - 1; i++) {
    const nextHighlight = highlight[highlight.length - 1] + words[i].length + 1;
    highlight.push(nextHighlight);
  }

  return {
    ...phrase,
    match: {
      type: 'acronymStartsWith',
      highlight,
    },
  };
};
