// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducers from './reducers';

let middlewareEnhancers;

if ( process.env.NODE_ENV !== 'production' ) {
	const composeEnhancers = composeWithDevTools({
		latency: 0,
	});
	middlewareEnhancers = composeEnhancers(applyMiddleware(thunk));
} else {
	middlewareEnhancers = applyMiddleware(thunk);
}

export default createStore(
	rootReducers,
	middlewareEnhancers,
);
