/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-30
 */

import { SummerConfig } from '../../../../../../utils/seasons';
import { isObject } from '../../../utils/transform';
import op from 'object-path';

/** Convert season object into redux data */
export function jsonToRedux ( seasons: Array<Object> ): ?Object {
	const node = seasons.find(s => s.id === SummerConfig.id);
	
	if ( node === null || !isObject(node) ) {
		return {};
	}
	
	const duration: number = op.get(node, 'duration', SummerConfig.duration);
	const precipitationChance: number = op.get(node, 'precipitation_chance', SummerConfig.precipitation_chance);
	const windyChance: number = op.get(node, 'windy_chance', SummerConfig.windy_chance);
	const minTemperature: number = op.get(node, 'min_temperature.value', SummerConfig.min_temperature);
	const maxTemperature: number = op.get(node, 'max_temperature.value', SummerConfig.max_temperature);
	
	return {[SummerConfig.id]: {
		duration,
		precipitationChance,
		windyChance,
		temperature: [minTemperature, maxTemperature],
	}};
}
