import React, { FunctionComponent, MouseEvent, useState, useEffect } from 'react';

import styles from './phrase.css';
import { IPhrase } from '../types';

interface Props extends IPhrase {
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

  let name: any = props.name;

  if (props.match) {
    const toHighlight: any = props.match.highlight.map((index) => props.name[index]);

    const highlighted = toHighlight.map((character: string, i: number) => <strong key={i}>{character}</strong>);

    name = [];

    for (let i = 0; i < props.match.highlight.length; i++) {
      name.push(highlighted[i]);
      name.push(props.name.slice(props.match.highlight[i] + 1, props.match.highlight[i + 1]));
    }
  }

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
