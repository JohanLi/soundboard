import React from 'react';

import Header from './Header';
import Menu from './Menu';
import Soundboard from './Soundboard';
import styles from './app.css';

const App = () => (
  <div>
    <Header />
    <div className={styles.main}>
      <Menu />
      <Soundboard />
    </div>
  </div>
);

export default App;
