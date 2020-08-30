/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

import { transformBoolean } from './../../utils/transform';

/** Convert environment json into redux data */
export function jsonToRedux ( json: Object ): Object {
	return transformBoolean(json, {
		root: 'environment.trees_everywhere.value',
		wrapperKey: 'treesEverywhere',
	});
}