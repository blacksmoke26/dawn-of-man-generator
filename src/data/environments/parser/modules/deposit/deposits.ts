/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import {deposits} from '~/utils/random';
import {transformSplitStringArray} from '~/utils/parser/transform';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

/** Convert environment json into redux data */
export const jsonToRedux = ( json: Json, options: JsonToReduxOptions = {} ): Json => {
	return transformSplitStringArray(json, {
		root: 'environment.deposits.values',
		wrapperKey: 'deposits',
		splitChar: ' ',
		minItems: 1,
		maxItems: 4,
		unique: true,
		itemsValidator: value => deposits.includes(value),
		...options,
	});
};
