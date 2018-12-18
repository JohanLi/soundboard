import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import Soundboard from './Soundboard';
import { loadSoundboard, stopAllSounds } from '../action';
import { IState, ISoundboards } from '../types';
import styles from './app.css';
import classNames from 'classnames';

interface Props {
  loading: boolean;
  soundboards: ISoundboards,
  activeSoundboard: string;
  loadSoundboard: (name?: string) => void;
  stopAllSounds: () => void;
}

const App: FunctionComponent<Props> = (props) => {
  useEffect(() => {
    props.loadSoundboard();

    return () => null;
  }, []);

  if (props.loading) {
    return (
      <>
        <Header />
        <div className={styles.main} key={props.activeSoundboard}>
          <div className={styles.menu} />
          <div className={styles.loading}>
            <img src="/assets/loading.svg" />
          </div>
        </div>
      </>
    )
  }

  const items = Object.keys(props.soundboards).map((soundboard) => {
    const itemClass = classNames({
      [styles.item]: true,
      [styles.active]: soundboard === props.activeSoundboard,
    });

    const { name } = props.soundboards[soundboard];

    return (
      <div
        key={soundboard}
        className={itemClass}
        onClick={() => {
          props.stopAllSounds();
          props.loadSoundboard(soundboard);
        }}
      >
        <img src={`/soundboards/${soundboard}/icon.png`} />
        <div className={styles.popover}>
          <div className={styles.name}>
            {name}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <Header />
      <div className={styles.main} key={props.activeSoundboard}>
        <div className={styles.menu}>
          {items}
        </div>
        <Soundboard />
      </div>
    </>
  );
};

const mapStateToProps = (state: IState) => ({
  loading: state.loading,
  soundboards: state.soundboards,
  activeSoundboard: state.activeSoundboard,
});

export default connect(
  mapStateToProps,
  {
    loadSoundboard,
    stopAllSounds,
  },
)(App);
