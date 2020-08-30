/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

import { transformNumericArray } from './../utils/transform';

/** Convert environment json into redux data */
export function jsonToRedux ( json: Object ): Object {
	return transformNumericArray(json, {
		root: 'environment.distance_height_offset',
		wrapperKey: 'distanceHeightOffset',
		minItems: 2,
		maxItems: 2,
	});
}
