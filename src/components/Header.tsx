import React, { FunctionComponent, useState, useEffect } from 'react';
import classNames from 'classnames';
import { remote } from 'electron';

const remoteWindow = remote.getCurrentWindow();

import styles from './header.css';

const Header: FunctionComponent = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const handleUnmaximize = () => setIsMaximized(false);
    const handleMaximize = () => setIsMaximized(true);

    remoteWindow.on('unmaximize', handleUnmaximize);
    remoteWindow.on('maximize', handleMaximize);

    return () => {
      remoteWindow.removeListener('unmaximize', handleUnmaximize);
      remoteWindow.removeListener('maximize', handleMaximize);
    }
  });

  const minimize = () => {
    remoteWindow.minimize();
  };

  const maximize = () => {
    if (remoteWindow.isMaximized()) {
      remoteWindow.unmaximize();
    } else {
      remoteWindow.maximize();
    }
  };

  const close = () => {
    remoteWindow.close();
  };

  const maximizeClass = classNames({
    [styles.maximize]: true,
    [styles.active]: isMaximized,
  });

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        Soundboard
      </div>
      <div className={styles.minimize} onClick={minimize} />
      <div className={maximizeClass} onClick={maximize} />
      <div className={styles.close} onClick={close} />
    </header>
  );
};

export default Header;
