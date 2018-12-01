import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { startedPlaying, stoppedPlaying } from '../actions';
import Phrase from './Phrase';
import styles from './soundboard.css';

const stopAllSounds = (playing) => {
  playing.forEach((audioElement) => {
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
  });
};

const Soundboard = ({ phrases, playing, startedPlaying, stoppedPlaying }) => {
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

  const phrasesJsx = phrases.map(phrase => (
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
        <h1 className={styles.h1}>Arnold Schwarzenegger</h1>
      </div>
      <ul className={styles.sections}>
        Pleasantries
      </ul>
      <ul className={styles.audio}>
        {phrasesJsx}
      </ul>
    </main>
  );
};

const mapStateToProps = state => ({
  name: state.name,
  phrases: state.phrases,
  playing: state.playing,
});

export default connect(
  mapStateToProps,
  {
    startedPlaying,
    stoppedPlaying,
  },
)(Soundboard);
