/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-30
 */

import op from 'object-path';

// Utils
import { SpringConfig } from '../../../../../../utils/seasons';
import { isObject } from '../../../utils/transform';

/** Convert season object into redux data */
export function jsonToRedux ( seasons: Array<Object> ): Object {
	const node = seasons.find(s => s.id === SpringConfig.id);
	
	if ( node === null || !isObject(node) ) {
		return {};
	}
	
	const duration: number = op.get(node, 'duration', SpringConfig.duration);
	const precipitationChance: number = op.get(node, 'precipitation_chance', SpringConfig.precipitation_chance);
	const windyChance: number = op.get(node, 'windy_chance', SpringConfig.windy_chance);
	const veryWindyChance: number = op.get(node, 'very_windy_chance', SpringConfig.very_windy_chance);
	const fishBoost: number = op.get(node, 'fish_boost', SpringConfig.fish_boost);
	const minTemperature: number = op.get(node, 'min_temperature.value', SpringConfig.min_temperature);
	const maxTemperature: number = op.get(node, 'max_temperature.value', SpringConfig.max_temperature);
	
	return {[SpringConfig.id]: {
		duration,
		precipitationChance,
		windyChance,
		veryWindyChance,
		fishBoost,
		temperature: [minTemperature, maxTemperature],
	}};
}
