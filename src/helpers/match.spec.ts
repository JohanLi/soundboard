import { wordStartsWith, acronymStartsWith } from './match';

const audioElement =  document.createElement('audio');

const phrases = [
  {
    name: 'Hi',
    audioElement,
  },
  {
    name: 'Good Morning',
    audioElement,
  },
  {
    name: 'What`s Going On',
    audioElement,
  },
];

test('able to match phrases that start with a given input', () => {
  const checkedPhrases = phrases.map((phrase) => wordStartsWith(phrase, 'go'));

  expect(checkedPhrases[0].match).toEqual(undefined);
  expect(checkedPhrases[1].match).toEqual({
    type: 'wordStartsWith',
    highlight: [0, 1],
  });
  expect(checkedPhrases[2].match).toEqual(undefined);
});

test('able to match phrase acronyms that start with a given input', () => {
  const checkedPhrases = phrases.map((phrase) => acronymStartsWith(phrase, 'wg'));

  expect(checkedPhrases[0].match).toEqual(undefined);
  expect(checkedPhrases[1].match).toEqual(undefined);
  expect(checkedPhrases[2].match).toEqual({
    type: 'acronymStartsWith',
    highlight: [0, 7],
  });
});
