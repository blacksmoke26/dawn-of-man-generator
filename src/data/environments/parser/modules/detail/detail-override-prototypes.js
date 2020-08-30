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
		root: 'environment.detail_override_prototypes.detail_override_prototype',
		wrapperKey: 'detailOverridePrototypes',
		transformOptions: {
			requiredProp: 'id',
			requiredPropValidator: ( id ) => random.details.includes(id),
			optionalProps: [
				'density',
				{group: 'altitude', key: 'min_altitude'},
				{group: 'altitude', key: 'max_altitude'},
				{group: 'humidity', key: 'min_humidity'},
				{group: 'humidity', key: 'max_humidity'},
				{group: 'angle', key: 'min_angle'},
				{group: 'angle', key: 'max_angle'},
			],
		}
	});
}
