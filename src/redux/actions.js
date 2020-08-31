// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

// Redux actions
import {
	SET_ENVIRONMENT,
} from './action-types';

// Utils
import { jsonToRedux } from './../data/environments/parser';

/**
 * @public
 * @static
 * @async
 * Parse and set environment data
 */
export function setEnvironment ( rawData: Object ): Promise<void> {
	return async ( dispatch: Dispatch ) => {
		const {environment}: Object = jsonToRedux(rawData, {
			nullResolver: ( wrapperKey: string ) => ({[wrapperKey]: false}),
		});
		dispatch({type: SET_ENVIRONMENT, payload: environment});
	};
}

/**
 * @public
 * @static
 * @async
 * Set parsed environment data
 */
export function setParsedEnvironment ( {environment = {}}: Object ): Promise<void> {
	return async ( dispatch: Dispatch ) => {
		dispatch({type: SET_ENVIRONMENT, payload: environment});
	};
}
