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
 * Set environment data
 */
export function setEnvironment ( rawData: Object ): Promise<void> {
	return async ( dispatch: Dispatch ) => {
		const {environment}: Object = jsonToRedux(rawData);
		dispatch({type: SET_ENVIRONMENT, payload: environment});
	};
}
