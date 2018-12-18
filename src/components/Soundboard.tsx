import React, {FunctionComponent, useState, useEffect, MouseEvent, ChangeEvent} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { changeSection, stopAllSounds, play, hidePhraseDropdown, renamePhrase, removePhrase } from '../action';
import { ISoundboards, ISections, IPhrases, IPhraseDropdown, IState } from '../types';
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
  phraseDropdown: IPhraseDropdown;
  changeSection: (section: string) => void;
  stopAllSounds: () => void;
  play: (id: string, e: MouseEvent) => void;
  hidePhraseDropdown: () => void;
  renamePhrase: (id: string, name: string) => void;
  removePhrase: () => void;
}

const renameModalInitial = {
  active: false,
  phraseId: '',
  newName: '',
};

const Soundboard: FunctionComponent<Props> = (props) => {
  const [renameModal, setRenameModal] = useState(renameModalInitial);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        props.stopAllSounds();
      }

      if (e.key === 'Escape' && renameModal.active) {
        setRenameModal(renameModalInitial);
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRenameModal({
      ...renameModal,
      newName: e.target.value,
    });
  };

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
          onClick={() => setRenameModal({ active: true, phraseId: props.phraseDropdown.phraseId, newName: '' })}
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

  let renameModalJsx = null;

  if (renameModal.active) {
    renameModalJsx = (
      <div className={styles.modal}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <div className={styles.newName}>
            Enter new name
          </div>
          <input
            type="text"
            placeholder={props.phrases[renameModal.phraseId].name}
            value={renameModal.newName}
            onChange={handleChange}
            autoFocus
          />
          <div className={styles.buttonWrapper}>
            <button type="button" className={styles.buttonWarning} onClick={() => setRenameModal(renameModalInitial)}>
              Cancel
            </button>
            <button type="button" className={styles.button} onClick={() => {
              props.renamePhrase(renameModal.phraseId, renameModal.newName);
              setRenameModal(renameModalInitial);
            }}>
              Ok
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className={styles.main}>
        <Search />
        <ul className={styles.sections}>
          {sections}
        </ul>
        <ul
          className={styles.phrases}
        >
          {phrases}
        </ul>
        {renameModalJsx}
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
    renamePhrase,
    removePhrase,
  },
)(Soundboard);
