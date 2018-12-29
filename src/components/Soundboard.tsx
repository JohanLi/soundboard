import React, { FunctionComponent, useEffect, MouseEvent, DragEvent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { changeSection, stopAllSounds, play, hidePhraseDropdown, removePhrase, addPhrases, openModal } from '../action';
import { ISoundboards, ISections, IPhrases, IPhraseDropdown, IState, ModalTypes } from '../types';
//import OutputDevice from './OutputDevice';
import Search from './Search';
import Phrase from './Phrase';
import Modal from './Modal';
import styles from './soundboard.css';

interface Props {
  soundboards: ISoundboards,
  activeSoundboard: string,
  sections: ISections,
  activeSection: string,
  phrases: IPhrases,
  phraseDropdown: IPhraseDropdown;
  changeSection: (section: string) => void;
  stopAllSounds: () => void;
  play: (id: string, e: MouseEvent) => void;
  hidePhraseDropdown: () => void;
  removePhrase: () => void;
  addPhrases: (e: DragEvent) => void;
  openModal: (type: ModalTypes, sectionOrPhraseId?: string) => void;
}

const Soundboard: FunctionComponent<Props> = (props) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        props.stopAllSounds();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', props.hidePhraseDropdown);
    window.addEventListener('contextmenu', props.hidePhraseDropdown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', props.hidePhraseDropdown);
      window.removeEventListener('contextmenu', props.hidePhraseDropdown);
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

    return (
      <Phrase
        key={phrase.id}
        id={phrase.id}
        name={phrase.name}
        audioElement={phrase.audioElement}
        play={props.play}
      />
    )
  });

  let phraseDropdown = null;

  if (props.phraseDropdown.active) {
    const { x, y } = props.phraseDropdown;

    phraseDropdown = (
      <div
        className={styles.dropdown}
        style={{top: y, left: x}}
      >
        <div
          className={styles.item}
          onClick={() => props.openModal('renamePhrase', props.phraseDropdown.phraseId)}
        >
          Rename
        </div>
        <div
          className={styles.item}
          onClick={props.removePhrase}
        >
          Remove
        </div>
      </div>
    );
  }

  return (
    <>
      <main className={styles.main} onDrop={props.addPhrases} onDragOver={(e) => e.preventDefault()}>
        <Search />
        <ul className={styles.sections}>
          {sections}
          <li
            className={styles.add}
            onClick={() => props.openModal('addSection')}
          >
            add new
          </li>
        </ul>
        <ul
          className={styles.phrases}
        >
          {phrases}
        </ul>
        <Modal />
      </main>
      {phraseDropdown}
    </>
  );
};

const mapStateToProps = (state: IState) => ({
  soundboards: state.soundboards,
  activeSoundboard: state.activeSoundboard,
  sections: state.sections,
  activeSection: state.activeSection,
  phrases: state.phrases,
  phraseDropdown: state.phraseDropdown,
});

export default connect(
  mapStateToProps,
  {
    changeSection,
    stopAllSounds,
    play,
    hidePhraseDropdown,
    removePhrase,
    addPhrases,
    openModal,
  },
)(Soundboard);
