import React, { useState, useRef } from 'react';

import styles from './phrase.css';

export default ({ src, name, startedPlaying, stoppedPlaying }) => {
  const [percent, setPercent] = useState(0);

  const audioElement = useRef(null);

  const onClick = () => {
    if (!audioElement.current.paused) {
      audioElement.current.pause();
      audioElement.current.currentTime = 0;
    } else {
      audioElement.current.play();
      startedPlaying(audioElement);
      window.requestAnimationFrame(updateProgress);
    }
  };

  const updateProgress = () => {
    const percent = (audioElement.current.currentTime / audioElement.current.duration) * 100;

    if (percent < 100 && !audioElement.current.paused) {
      window.requestAnimationFrame(updateProgress);
      setPercent(percent);
    } else {
      setPercent(0);
      stoppedPlaying(src);
    }
  };

  return (
    <li
      className={styles.button}
      onClick={onClick}
      style={{ background: `linear-gradient(90deg, #ccc ${percent}%, #ddd 0%)` }}
    >
      {name}
      <audio src={src} ref={audioElement} />
    </li>
  );
}
