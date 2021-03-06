// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

// Types
import type { JsonToReduxOptions } from './../types/index.flow';

// Utils
import { transformSplitStringArray } from './../utils/transform';

/** Convert environment json into redux data */
export function jsonToRedux ( json: Object, options: JsonToReduxOptions = {} ): Object {
	return transformSplitStringArray(json, {
		root: 'environment.backdrop_scale.value',
		wrapperKey: 'backdropScale',
		splitChar: ',',
		minItems: 3,
		maxItems: 3,
		transformValue: ( value: string ) => Number(value),
		...options,
	});
}
