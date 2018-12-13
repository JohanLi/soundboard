import React, { FunctionComponent, ChangeEvent, useState } from 'react';
import { connect } from 'react-redux';

import { minimizeWindow } from '../action';
import { wordStartsWith, acronymStartsWith } from '../helpers/match';
import { IState, ISections } from '../types';
import Phrase from './Phrase';
import styles from './search.css';
import classNames from 'classnames';

interface Props {
  sections: ISections;
  minimizeWindow: () => void;
}

const Search: FunctionComponent<Props> = (props) => {
  const [input, setInput] = useState('');
  const [focus, setFocus] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const phrases = Object.keys(props.sections).reduce((phrases, section) => {
    return [...phrases, ...props.sections[section].phrases];
  }, []);

  let resultPhrases: any[] = [];

  if (input) {
    resultPhrases = phrases
      .map((phrase) => wordStartsWith(phrase, input))
      .map((phrase) => acronymStartsWith(phrase, input))
      .filter((phrase) => phrase.match)
      .map((phrase) => (
        <Phrase
          key={phrase.name}
          name={phrase.name}
          audioElement={phrase.audioElement}
          match={phrase.match}
          minimizeWindow={props.minimizeWindow}
        />
      ));
  }

  const resultsClass = classNames({
    [styles.results]: true,
    [styles.expand]: focus || resultPhrases.length,
  });

  return (
    <div className={styles.search}>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={styles.input}
        onClick={() => setInput('')}
        placeholder="Search"
      />
      <div className={resultsClass}>
        {resultPhrases}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  sections: state.sections,
});

export default connect(
  mapStateToProps,
  {
    minimizeWindow,
  }
)(Search);
