import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';

// store
import {store} from '~redux/store';

// components
import App from './App';

// reporting
import reportWebVitals from './reportWebVitals';

import '~/styles/uikit/bootstrap.min.css';
import '~/styles/uikit/bootstrap_limitless.min.css';
import '~/styles/uikit/layout.min.css';
import '~/styles/uikit/colors.min.css';
import 'rc-slider/assets/index.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '~/styles/custom.css';
import '~/styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example, reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
