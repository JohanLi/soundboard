import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { changeSection, stopAllSounds, loadSoundboard } from '../actions';
import OutputDevice from './OutputDevice';
import Phrase from './Phrase';
import styles from './soundboard.css';

interface Soundboards {
  [key: string]: {
    name: string;
  }
}

interface Sections {
  [key: string]: {
    name: string;
    phrases: Phrase[];
  }
}

interface Phrase {
  name: string;
  audioElement: HTMLAudioElement;
}

interface Props {
  soundboards: Soundboards,
  activeSoundboard: string,
  name: string,
  sections: Sections,
  activeSection: string,
  changeSection: (section: string) => void;
  loadSoundboard: (name?: string) => void;
  stopAllSounds: () => void;
}

interface State {
  soundboards: Soundboards,
  activeSoundboard: string,
  name: string,
  sections: Sections,
  activeSection: string,
}

const Soundboard: FunctionComponent<Props> = (props) => {
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    props.loadSoundboard();

    return () => null;
  }, []);

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

  const soundboards = Object.keys(props.soundboards).map((soundboard) => (
    <li
      key={soundboard}
      onClick={() => {
        props.stopAllSounds();
        props.loadSoundboard(soundboard);
      }}
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

const mapStateToProps = (state: State) => ({
  soundboards: state.soundboards,
  activeSoundboard: state.activeSoundboard,
  name: state.name,
  sections: state.sections,
  activeSection: state.activeSection,
});

export default connect(
  mapStateToProps,
  {
    changeSection,
    stopAllSounds,
    loadSoundboard,
  },
)(Soundboard);
