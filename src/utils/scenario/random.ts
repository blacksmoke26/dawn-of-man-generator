/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import randomInt from 'random-int';

// Utils
import {MAP_SIZE_MIN, MAP_SIZE_MAX} from './defaults';

/** Random map size */
export const randomMapSize = (): number => randomInt(MAP_SIZE_MIN, MAP_SIZE_MAX);
