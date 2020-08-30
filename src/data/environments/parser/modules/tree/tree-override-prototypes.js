/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

// Utils
import * as random from './../../../../../utils/random';
import { transformOverrideObject } from './../../utils/transform';

/** Convert environment json into redux data */
export function jsonToRedux ( json: Object ): Object {
	return transformOverrideObject(json, {
		root: 'environment.tree_override_prototypes.tree_override_prototype',
		wrapperKey: 'treeOverridePrototypes',
		transformOptions: {
			requiredProp: 'id',
			requiredPropValidator: ( id ) => random.trees.includes(id),
			optionalProps: [
				'density',
				{group: 'altitude', key: 'min_altitude'},
				{group: 'altitude', key: 'max_altitude'},
				{group: 'angle', key: 'min_angle'},
				{group: 'angle', key: 'max_angle'},
			],
		}
	});
}
