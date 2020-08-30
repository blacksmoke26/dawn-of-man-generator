/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

// Types
import type { JsonToReduxOptions } from './../../types/index.flow';

// Utils
import { transformSplitStringArray } from './../../utils/transform';
import * as random from './../../../../../utils/random';

/** Convert environment json into redux data */
export function jsonToRedux ( json: Object, options: JsonToReduxOptions = {} ): Object {
	return transformSplitStringArray(json, {
		root: 'environment.deposits.values',
		wrapperKey: 'deposits',
		splitChar: ' ',
		itemsValidator: ( value: string ) => random.deposits.includes(value),
		...options,
	});
}
