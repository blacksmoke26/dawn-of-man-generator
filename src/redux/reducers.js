// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

// Redux actions
import {
	ENVIRONMENT_NOISE_AMPLITUDES,
} from './action-types';

/** `ReduxAppState` type */
export type ReduxAppState = {
	environment: Object,
};

/**
 * @private
 * Redux store initial state */
const initialState: ReduxAppState = {
	environment: {},
}

/**
 * @public
 * @static
 * Root reducer / action states resolver */
export default function rootReducer ( state: ReduxAppState = initialState, action: { type: string, payload: any } ): ReduxAppState {
	const {type, payload} = action;
	
	return state;
}
