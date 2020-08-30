/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-30
 */

import { FallConfig } from '../../../../../../utils/seasons';
import { isObject } from '../../../utils/transform';
import op from 'object-path';

/** Convert season object into redux data */
export function jsonToRedux ( seasons: Array<Object> ): ?Object {
	const node = seasons.find(s => s.id === FallConfig.id);
	
	if ( node === null || !isObject(node) ) {
		return {};
	}
	
	const duration: number = op.get(node, 'duration', FallConfig.duration);
	const precipitationChance: number = op.get(node, 'precipitation_chance', FallConfig.precipitation_chance);
	const windyChance: number = op.get(node, 'windy_chance', FallConfig.windy_chance);
	const veryWindyChance: number = op.get(node, 'very_windy_chance', FallConfig.very_windy_chance);
	const minTemperature: number = op.get(node, 'min_temperature.value', FallConfig.min_temperature);
	const maxTemperature: number = op.get(node, 'max_temperature.value', FallConfig.max_temperature);
	
	return {[FallConfig.id]: {
		duration,
		precipitationChance,
		windyChance,
		veryWindyChance,
		temperature: [minTemperature, maxTemperature],
	}};
}
