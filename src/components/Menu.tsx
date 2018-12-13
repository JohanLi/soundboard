import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './menu.css';
import { loadSoundboard, stopAllSounds } from '../action';

import { ISoundboards, IState } from '../types';

interface Props {
  soundboards: ISoundboards,
  activeSoundboard: string,
  loadSoundboard: (name?: string) => void;
  stopAllSounds: () => void;
}

const Menu: FunctionComponent<Props> = (props) => {
  useEffect(() => {
    props.loadSoundboard();

    return () => null;
  }, []);

  const items = Object.keys(props.soundboards).map((soundboard) => {
    const itemClass = classNames({
      [styles.item]: true,
      [styles.active]: soundboard === props.activeSoundboard,
    });

    return (
      <div
        className={itemClass}
        onClick={() => {
          props.stopAllSounds();
          props.loadSoundboard(soundboard);
        }}
      >
        <img src={`/soundboards/${soundboard}/icon.png`} />
      </div>
    );
  });

  return (
    <div className={styles.menu}>
      {items}
    </div>
  )
};

const mapStateToProps = (state: IState) => ({
  soundboards: state.soundboards,
  activeSoundboard: state.activeSoundboard,
  name: state.name,
  sections: state.sections,
  activeSection: state.activeSection,
});

export default connect(
  mapStateToProps,
  {
    loadSoundboard,
    stopAllSounds,
  },
)(Menu);
