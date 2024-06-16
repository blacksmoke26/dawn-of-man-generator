/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

// utils
import * as random from '~/utils/random';
import { transformOverrideObject } from '~/utils/parser/transform';

/** Convert environment json into redux data */
export const jsonToRedux = ( json: Json, options: JsonToReduxOptions = {} ): Json => {
	return transformOverrideObject(json, {
		root: 'environment.tree_override_prototypes.tree_override_prototype',
		wrapperKey: 'treeOverridePrototypes',
		transformOptions: {
			requiredProp: 'id',
			requiredPropValidator: (id) => random.trees.includes(id),
			optionalProps: [
				'density',
				{group: 'altitude', key: 'min_altitude'},
				{group: 'altitude', key: 'max_altitude'},
				{group: 'humidity', key: 'min_humidity'},
				{group: 'humidity', key: 'max_humidity'},
				{group: 'angle', key: 'min_angle'},
				{group: 'angle', key: 'max_angle'},
			],
		},
		...options,
	});
};
