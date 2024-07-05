/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import {normalizeFloat} from '~/helpers/number';
import {transformNumeric} from '~/utils/parser/transform';
import {DENSITY_MAX, DENSITY_MIN} from '~/utils/defaults';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

/** Convert environment json into redux data */
export const jsonToRedux = ( json: Json, options: JsonToReduxOptions = {} ): Json => {
	return transformNumeric(json, {
		root: 'environment.global_tree_density.value',
		wrapperKey: 'globalTreeDensity',
		transform(value: number): number {
			return normalizeFloat(value, {
				min: DENSITY_MIN,
				max: DENSITY_MAX,
				decimals: 2,
			}) as number;
		},
		...options,
	});
};
