/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

import eurasia, { info as info1 } from './eurasia';
import eurasia_conflict, { info as info2 } from './eurasia_conflict';
import eurasia_flatlands, { info as info3 } from './eurasia_flatlands';
import eurasia_glacial, { info as info4 } from './eurasia_glacial';
import eurasia_north, { info as info5 } from './eurasia_north';
import eurasia_warm, { info as info6 } from './eurasia_warm';
import flat, { info as info7 } from './flat';

/** Builtin environments labels */
export const labels: Array<Object> = [
	info1, info2, info3,
	info4, info5, info6,
	info7,
];

/** Builtin environments */
export const environments: Object = {
	eurasia,
	eurasia_conflict,
	eurasia_flatlands,
	eurasia_glacial,
	eurasia_north,
	eurasia_warm,
	flat,
};
