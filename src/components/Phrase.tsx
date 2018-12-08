import React, { FunctionComponent, useState, useEffect } from 'react';

import styles from './phrase.css';

interface Props {
  name: string;
  audioElement: HTMLAudioElement;
}

const Phrase: FunctionComponent<Props> = ({ name, audioElement }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let requestId: number;

    const updateProgress = () => {
      const percent = (audioElement.currentTime / audioElement.duration) * 100;
      setPercent(percent);

      requestId = window.requestAnimationFrame(updateProgress);
    };

    const cancelUpdate = () => {
      setPercent(0);
      window.cancelAnimationFrame(requestId);
    };

    audioElement.addEventListener('play', updateProgress);
    audioElement.addEventListener('pause', cancelUpdate);

    return () => {
      cancelUpdate();
      audioElement.removeEventListener('play', updateProgress);
      audioElement.removeEventListener('pause', cancelUpdate);
    };
  }, []);

  const onClick = () => {
    if (!audioElement.paused) {
      audioElement.pause();
      audioElement.currentTime = 0;
    } else {
      audioElement.play();
    }
  };

  return (
    <li
      className={styles.button}
      onClick={onClick}
      style={{ background: `linear-gradient(90deg, #ccc ${percent}%, #ddd 0%)` }}
    >
      {name}
    </li>
  );
};

export default Phrase;
