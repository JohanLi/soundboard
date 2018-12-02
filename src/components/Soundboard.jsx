import React, { useEffect } from 'react';
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

  if (!props.name) {
    return null;
  }

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
    <main className={styles.main}>
      <div className={styles.title}>
        <h1 className={styles.h1}>
          {props.name}
        </h1>
      </div>
      <ul className={styles.sections}>
        {sections}
      </ul>
      {sectionsOfPhrases}
    </main>
  );
};

const mapStateToProps = state => ({
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
