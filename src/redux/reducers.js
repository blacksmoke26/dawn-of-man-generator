// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

// Redux actions
import {SET_ENVIRONMENT, SET_SCENARIO} from './action-types';

/** `ReduxAppState` type */
export type ReduxAppState = {
	environment: {
		noiseAmplitudes: [number, number, number, number, number, number, number, number] | boolean,
		resourceFactor: number | boolean,
		distanceHeightOffset: number | boolean,
		fordDistanceFactor: number | boolean,
		sunAngleFactor: number | boolean,
		backdropScale: [number, number, number] | boolean,
		deposits: Array<string> | boolean,
		depositOverridePrototypes: Object | boolean,
		detailOverridePrototypes: Object | boolean,
		propOverridePrototypes: Object | boolean,
		globalTreeDensity: number|boolean,
		treesEverywhere: boolean,
		trees: Array<string> | boolean,
		treeOverridePrototypes: Object | boolean,
		seasons: Object | boolean,
	},
	scenario: {
		size: number|boolean,
		locations: Array<Object>|boolean,
	},
};

/**
 * @private
 * Redux store initial state */
const initialState: ReduxAppState = {
	environment: {},
	scenario: {},
}

/**
 * @public
 * @static
 * Root reducer / action states resolver */
export default function rootReducer ( state: ReduxAppState = initialState, action: { type: string, payload: any } ): ReduxAppState {
	const {type, payload} = action;
	
	if ( type === SET_ENVIRONMENT ) {
		return {
			...state,
			environment: {...payload},
		}
	}
	
	if ( type === SET_SCENARIO ) {
		return {
			...state,
			scenario: {...payload},
		}
	}
	
	return state;
}
