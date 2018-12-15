import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { changeSection, stopAllSounds, loadSoundboard, minimizeWindow } from '../action';
import { ISoundboards, ISections, IPhrases, IState } from '../types';
//import OutputDevice from './OutputDevice';
import Search from './Search';
import Phrase from './Phrase';
import styles from './soundboard.css';

interface Props {
  soundboards: ISoundboards,
  activeSoundboard: string,
  sections: ISections,
  activeSection: string,
  phrases: IPhrases,
  changeSection: (section: string) => void;
  loadSoundboard: (name?: string) => void;
  stopAllSounds: () => void;
  minimizeWindow: () => void;
}

const Soundboard: FunctionComponent<Props> = (props) => {
  useEffect(() => {
    const handleKeypress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        props.stopAllSounds();
      }
    };

    window.addEventListener('keypress', handleKeypress);

    return () => {
      window.removeEventListener('keypress', handleKeypress)
    };
  });

  if (!props.activeSoundboard) {
    return null;
  }

  const sections = Object.keys(props.sections).map((section) => {
    const sectionClass = classNames({
      [styles.section]: true,
      [styles.active]: section === props.activeSection,
    });

    return (
      <li
        key={section}
        className={sectionClass}
        onClick={() => props.changeSection(section)}
      >
        {props.sections[section].name}
      </li>
    );
  });

  const phrases = props.sections[props.activeSection].phrases.map((phraseId) => {
    const phrase = props.phrases[phraseId];
    const key = `${props.activeSoundboard}:${phraseId}`; // two soundboards can share the same phraseId

    return (
      <Phrase
        key={key}
        name={phrase.name}
        audioElement={phrase.audioElement}
        minimizeWindow={props.minimizeWindow}
      />
    )
  });

  return (
    <main className={styles.main} style={{ backgroundImage: `url('soundboards/${props.activeSoundboard}/avatar.png')` }}>
      <Search />
      <ul className={styles.sections}>
        {sections}
      </ul>
      <ul
        className={styles.phrases}
      >
        {phrases}
      </ul>
    </main>
  );
};

const mapStateToProps = (state: IState) => ({
  soundboards: state.soundboards,
  activeSoundboard: state.activeSoundboard,
  sections: state.sections,
  activeSection: state.activeSection,
  phrases: state.phrases,
});

export default connect(
  mapStateToProps,
  {
    changeSection,
    stopAllSounds,
    loadSoundboard,
    minimizeWindow,
  },
)(Soundboard);
