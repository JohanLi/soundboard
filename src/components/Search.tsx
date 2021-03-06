import React, { FunctionComponent, ChangeEvent, MouseEvent, KeyboardEvent, useState } from 'react';
import { connect } from 'react-redux';

import { play } from '../action';
import { wordStartsWith, acronymStartsWith } from '../helpers/match';
import { IState, IPhrases, IPhrase } from '../types';
import Phrase from './Phrase';
import styles from './search.css';
import classNames from 'classnames';

interface Props {
  phrases: IPhrases;
  name: string;
  play: (id: string, e: MouseEvent | KeyboardEvent) => void;
}

const Search: FunctionComponent<Props> = (props) => {
  const [input, setInput] = useState('');
  const [focus, setFocus] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.play(matchedPhrases[0].id, e);
      setInput('');
    }

    if (e.key === 'Escape') {
      e.currentTarget.blur();
      setInput('');
    }
  };

  let phrases: any[] = [];
  let matchedPhrases: IPhrase[] = [];

  if (input) {
    matchedPhrases = Object.keys(props.phrases)
      .map((phraseId) => props.phrases[phraseId])
      .map((phrase) => wordStartsWith(phrase, input))
      .map((phrase) => acronymStartsWith(phrase, input))
      .filter((phrase) => phrase.match);

    phrases = matchedPhrases
      .map((phrase) => (
        <Phrase
          key={phrase.id}
          id={phrase.id}
          name={phrase.name}
          audioElement={phrase.audioElement}
          play={props.play}
          match={phrase.match}
        />
      ));
  }

  const resultsClass = classNames({
    [styles.results]: true,
    [styles.expand]: focus || phrases.length,
  });

  return (
    <div className={styles.search}>
      <div className={styles.top}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={handleKeyDown}
          className={styles.input}
          onClick={() => setInput('')}
          placeholder="Search"
        />
        <div className={styles.name}>
          {props.name}
        </div>
      </div>
      <div className={resultsClass}>
        {phrases}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  phrases: state.phrases,
  name: state.soundboards[state.activeSoundboard].name,
});

export default connect(
  mapStateToProps,
  {
    play,
  }
)(Search);
