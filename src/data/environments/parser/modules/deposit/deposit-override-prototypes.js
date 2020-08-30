/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

// Types
import type { JsonToReduxOptions } from './../../types/index.flow';

// Utils
import * as random from './../../../../../utils/random';
import { transformOverrideObject } from './../../utils/transform';

/** Convert environment json into redux data */
export function jsonToRedux ( json: Object, options: JsonToReduxOptions = {} ): Object {
	return transformOverrideObject(json, {
		root: 'environment.deposit_override_prototypes.deposit_override_prototype',
		wrapperKey: 'depositOverridePrototypes',
		transformOptions: {
			requiredProp: 'id',
			requiredPropValidator: ( id ) => random.deposits.includes(id),
			optionalProps: [
				{group: 'altitude', key: 'min_altitude'},
				{group: 'altitude', key: 'max_altitude'},
				{group: 'angle', key: 'min_angle'},
				{group: 'angle', key: 'max_angle'},
			],
		},
		...options,
	});
}
