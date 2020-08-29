// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Components
import App from './App';

// Redux
import store from './redux/store';

import './styles/uikit/bootstrap.min.css';
import './styles/uikit/bootstrap_limitless.min.css';
import './styles/uikit/layout.min.css';
import './styles/uikit/colors.min.css';
import 'rc-slider/assets/index.css';
import './styles/custom.css';
import './styles/global.css';

ReactDOM.render((
	<Provider store={store}>
		<App />
	</Provider>
), document.getElementById('root'));
