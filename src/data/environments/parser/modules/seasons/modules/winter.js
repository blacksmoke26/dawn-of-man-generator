/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-30
 */

import { WinterConfig } from '../../../../../../utils/seasons';
import { isObject } from '../../../utils/transform';
import op from 'object-path';

/** Convert season object into redux data */
export function jsonToRedux ( seasons: Array<Object> ): ?Object {
	const node = seasons.find(s => s.id === WinterConfig.id);
	
	if ( node === null || !isObject(node) ) {
		return {};
	}
	
	const duration: number = op.get(node, 'duration', WinterConfig.duration);
	const precipitationChance: number = op.get(node, 'precipitation_chance', WinterConfig.precipitation_chance);
	const windyChance: number = op.get(node, 'windy_chance', WinterConfig.windy_chance);
	const veryWindyChance: number = op.get(node, 'very_windy_chance', WinterConfig.very_windy_chance);
	const reducedFauna: number = op.get(node, 'reduced_fauna', WinterConfig.reduced_fauna);
	const minTemperature: number = op.get(node, 'min_temperature.value', WinterConfig.min_temperature);
	const maxTemperature: number = op.get(node, 'max_temperature.value', WinterConfig.max_temperature);
	
	return {[WinterConfig.id]: {
			duration,
			precipitationChance,
			windyChance,
			veryWindyChance,
			reducedFauna,
			temperature: [minTemperature, maxTemperature],
		}};
}
