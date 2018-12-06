import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware  } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import soundboard from './reducers';
import App from './components/App';
import './index.css';

const store = createStore(
  soundboard,
  applyMiddleware(thunk),
);

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root'),
);
