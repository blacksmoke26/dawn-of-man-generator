// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-09-01
 */

import randomInt from 'random-int';

// Utils
import * as Defaults from './defaults';

/** Random map size */
export function randomMapSize (): number {
	return randomInt(Defaults.MAP_SIZE_MIN, Defaults.MAP_SIZE_MAX);
}
