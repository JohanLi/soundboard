import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { changeSection, startedPlaying, stoppedPlaying, loadSoundboard } from '../actions';
import Phrase from './Phrase';
import styles from './soundboard.css';

const stopAllSounds = (playing) => {
  playing.forEach((audioElement) => {
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
  });
};

const Soundboard = (props) => {
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    props.loadSoundboard();

    return () => null;
  }, []);

  useEffect(() => {
    const handleKeypress = (e) => {
      if (e.key === ' ') {
        stopAllSounds(props.playing);
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
        key={phrase.src}
        name={phrase.name}
        src={phrase.src}
        startedPlaying={props.startedPlaying}
        stoppedPlaying={props.stoppedPlaying}
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
    <main className={styles.main} style={{ backgroundImage: `url('/soundboards/${props.activeSoundboard}/avatar.png')` }}>
      <div className={styles.switch} onClick={() => setDropdown(!dropdown)}>
        <div className={styles.name}>
          {props.soundboards[props.activeSoundboard].name}
        </div>
        <div className={dropdownClass}>
          {soundboards}
        </div>
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
  playing: state.playing,
});

export default connect(
  mapStateToProps,
  {
    changeSection,
    startedPlaying,
    stoppedPlaying,
    loadSoundboard,
  },
)(Soundboard);
