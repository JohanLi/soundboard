import React, { FunctionComponent, MouseEvent, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import styles from './phrase.css';
import { IPhrase } from '../types';
import { showPhraseDropdown } from '../action';

interface Props extends IPhrase {
  play: (id: string, e: MouseEvent) => void;
  showPhraseDropdown: (id: string, e: MouseEvent) => void;
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
      onContextMenu={(e) => props.showPhraseDropdown(props.id, e)}
      style={{ background: `linear-gradient(90deg, #ccc ${percent}%, #ddd 0%)` }}
    >
      <div className={styles.text} onClick={(e) => props.play(props.id, e)}>
        {name}
      </div>
    </li>
  );
};

export default connect(
  null,
  {
    showPhraseDropdown,
  },
)(Phrase);
