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

const Soundboard = ({ name, sections, activeSection, changeSection, playing, startedPlaying, stoppedPlaying, loadSoundboard }) => {
  useEffect(() => {
    loadSoundboard();

    return () => null;
  }, []);

  useEffect(() => {
    const handleKeypress = (e) => {
      if (e.key === ' ') {
        stopAllSounds(playing);
      }
    };

    window.addEventListener('keypress', handleKeypress);

    return () => {
      window.removeEventListener('keypress', handleKeypress)
    };
  });

  if (!name) {
    return null;
  }

  const sectionsJsx = Object.keys(sections).map((section) => {
    const style = classNames({
      [styles.section]: true,
      [styles.active]: section === activeSection,
    });

    return (
      <li
        key={section}
        className={style}
        onClick={() => changeSection(section)}
      >
        {sections[section].name}
      </li>
    );
  });

  const phrasesJsx = sections[activeSection].phrases.map(phrase => (
    <Phrase
      key={phrase.src}
      name={phrase.name}
      src={phrase.src}
      startedPlaying={startedPlaying}
      stoppedPlaying={stoppedPlaying}
    />
  ));

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1 className={styles.h1}>
          {name}
        </h1>
      </div>
      <ul className={styles.sections}>
        {sectionsJsx}
      </ul>
      <ul className={styles.audio}>
        {phrasesJsx}
      </ul>
    </main>
  );
};

const mapStateToProps = state => ({
  name: state.name,
  sections: state.sections,
  activeSection: state.activeSection,
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
