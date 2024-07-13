/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

// store
import {store, persistor} from '~redux/store';

// components
import App from './App';

import '~/styles/uikit/bootstrap.min.css';
import '~/styles/uikit/bootstrap_limitless.min.css';
import '~/styles/uikit/layout.min.css';
import '~/styles/uikit/colors.min.css';
import 'rc-slider/assets/index.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '~/styles/custom.css';
import '~/styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App/>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
