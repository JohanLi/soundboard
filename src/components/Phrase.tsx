import React, { FunctionComponent, MouseEvent, useState, useEffect } from 'react';

import styles from './phrase.css';

interface Props {
  name: string;
  audioElement: HTMLAudioElement;
  minimizeWindow: () => void;
}

const Phrase: FunctionComponent<Props> = (props) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let requestId: number;

    const updateProgress = () => {
      const percent = (props.audioElement.currentTime / props.audioElement.duration) * 100;
      setPercent(percent);

      requestId = window.requestAnimationFrame(updateProgress);
    };

    const cancelUpdate = () => {
      setPercent(0);
      window.cancelAnimationFrame(requestId);
    };

    props.audioElement.addEventListener('play', updateProgress);
    props.audioElement.addEventListener('pause', cancelUpdate);

    return () => {
      cancelUpdate();
      props.audioElement.removeEventListener('play', updateProgress);
      props.audioElement.removeEventListener('pause', cancelUpdate);
    };
  }, []);

  const onClick = (e: MouseEvent) => {
    if (!props.audioElement.paused) {
      props.audioElement.pause();
      props.audioElement.currentTime = 0;
    } else {
      props.audioElement.play();

      if (e.ctrlKey || e.metaKey) {
        props.minimizeWindow();
      }
    }
  };

  return (
    <li
      className={styles.button}
      onClick={onClick}
      style={{ background: `linear-gradient(90deg, #ccc ${percent}%, #ddd 0%)` }}
    >
      {props.name}
    </li>
  );
};

export default Phrase;
