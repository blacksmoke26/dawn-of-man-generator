/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from './../index.types';

// utils
import { transformNumericArray } from './../utils/transform';

/** Convert environment json into redux data */
export const jsonToRedux = ( json: Json, options: JsonToReduxOptions = {} ): Json => {
	return transformNumericArray(json, {
		root: 'environment.distance_height_offset',
		wrapperKey: 'distanceHeightOffset',
		minItems: 2,
		maxItems: 2,
		...options,
	});
};