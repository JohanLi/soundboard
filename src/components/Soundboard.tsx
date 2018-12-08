import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { changeSection, stopAllSounds, loadSoundboard } from '../actions';
import OutputDevice from './OutputDevice';
import Phrase from './Phrase';
import styles from './soundboard.css';

const Soundboard = (props) => {
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    props.loadSoundboard();

    return () => null;
  }, []);

  useEffect(() => {
    const handleKeypress = (e) => {
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

  const soundboards = Object.keys(props.soundboards).map((soundboard) => (
    <li
      key={soundboard}
      onClick={() => props.loadSoundboard(soundboard)}
    >
      {props.soundboards[soundboard].name}
    </li>
  ));

  const dropdownClass = classNames({
    [styles.dropdown]: true,
    [styles.active]: dropdown,
  });

  const sections = Object.keys(props.sections).map((section) => {
    const style = classNames({
      [styles.section]: true,
      [styles.active]: section === props.activeSection,
    });

    return (
      <li
        key={section}
        className={style}
        onClick={() => props.changeSection(section)}
      >
        {props.sections[section].name}
      </li>
    );
  });

  /*
    keeping all <Phrase> components in the DOM but hiding them based on activeSection allows us to
    switch section while audio for the previous section is still playing.
  */
  const sectionsOfPhrases = Object.keys(props.sections).map((section) => {
    const style = classNames({
      [styles.sectionOfPhrases]: true,
      [styles.hidden]: section !== props.activeSection,
    });

    const phrases = props.sections[section].phrases.map((phrase) => (
      <Phrase
        key={phrase.name}
        name={phrase.name}
        audioElement={phrase.audioElement}
        activeDevice={props.activeDevice}
      />
    ));

    return (
      <ul
        key={section}
        className={style}
      >
        {phrases}
      </ul>
    );
  });

  return (
    <main className={styles.main} style={{ backgroundImage: `url('soundboards/${props.activeSoundboard}/avatar.png')` }}>
      <div className={styles.top}>
        <div className={styles.switch} onClick={() => setDropdown(!dropdown)}>
          <div className={styles.name}>
            {props.soundboards[props.activeSoundboard].name}
          </div>
          <div className={dropdownClass}>
            {soundboards}
          </div>
        </div>
        <OutputDevice />
      </div>
      <ul className={styles.sections}>
        {sections}
      </ul>
      {sectionsOfPhrases}
    </main>
  );
};

const mapStateToProps = state => ({
  soundboards: state.soundboards,
  activeSoundboard: state.activeSoundboard,
  name: state.name,
  sections: state.sections,
  activeSection: state.activeSection,
  phrases: state.phrases,
  activeDevice: state.activeDevice,
});

export default connect(
  mapStateToProps,
  {
    changeSection,
    stopAllSounds,
    loadSoundboard,
  },
)(Soundboard);
