import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import { connect } from 'react-redux';

import { renamePhrase, addSection, closeModal } from '../action';
import { IState, IModal, ISections, IPhrases } from '../types';
import styles from './modal.css';

interface Props {
  modal: IModal;
  sections: ISections;
  phrases: IPhrases;
  renamePhrase: (phraseId: string, newName: string) => void;
  addSection: (name: string) => void;
  closeModal: () => void;
}

const Modal: FunctionComponent<Props> = (props) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const close = () => {
    setValue('');
    props.closeModal();
  };

  if (!props.modal) {
    return null;
  }

  let content;

  switch(props.modal.type) {
    case 'renamePhrase':
      content = (
        <form onSubmit={() => {
          props.renamePhrase(props.modal.phraseId, value);
          close();
        }}>
          <div className={styles.newName}>
            Enter new name
          </div>
          <input
            type="text"
            placeholder={props.phrases[props.modal.phraseId].name}
            value={value}
            onChange={handleChange}
            autoFocus
            required
          />
          <div className={styles.buttonWrapper}>
            <button type="button" className={styles.buttonWarning} onClick={close}>
              Cancel
            </button>
            <button type="submit" className={styles.button}>
              Ok
            </button>
          </div>
        </form>
      );
      break;
    case 'addSection':
      content = (
        <form onSubmit={() => {
          props.addSection(value);
          close();
        }}>
          <div className={styles.newName}>
            Enter name
          </div>
          <input
            type="text"
            placeholder="Section"
            value={value}
            onChange={handleChange}
            autoFocus
            required
          />
          <div className={styles.buttonWrapper}>
            <button type="button" className={styles.buttonWarning} onClick={close}>
              Cancel
            </button>
            <button type="submit" className={styles.button}>
              Ok
            </button>
          </div>
        </form>
      );
      break;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        {content}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  modal: state.modal,
  sections: state.sections,
  phrases: state.phrases,
});

export default connect(
  mapStateToProps,
  {
    renamePhrase,
    addSection,
    closeModal,
  },
)(Modal);
