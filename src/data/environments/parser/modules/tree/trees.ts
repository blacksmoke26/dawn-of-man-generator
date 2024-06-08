/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from './../../index.types';

// Utils
import { transformSplitStringArray } from './../../utils/transform';

/** Convert environment json into redux data */
export const jsonToRedux = ( json: Json, options: JsonToReduxOptions = {} ): Json => {
	return transformSplitStringArray(json, {
		root: 'environment.trees.values',
		wrapperKey: 'trees',
		...options,
	});
};