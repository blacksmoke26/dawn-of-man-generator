/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';

// helpers
import { isObject } from '~/helpers/object';

// utils
import { SpringConfig } from '~/utils/seasons';

// types
import type {Json} from '~/types/json.types';

/** Convert a season object into redux data */
export const jsonToRedux = ( seasons: Json[] ): Json => {
	const node = seasons.find(s => s.id === SpringConfig.id) as Json | null;

	if ( node === null || !isObject(node) ) {
		return {};
	}

	const duration = op.get<number>(node, 'duration', SpringConfig.duration);
	const precipitationChance = op.get<number>(node, 'precipitation_chance', SpringConfig.precipitation_chance);
	const windyChance = op.get<number>(node, 'windy_chance', SpringConfig.windy_chance);
	const veryWindyChance = op.get<number>(node, 'very_windy_chance', SpringConfig.very_windy_chance);
	const fishBoost = op.get<number>(node, 'fish_boost', SpringConfig.fish_boost);
	const minTemperature = op.get<number>(node, 'min_temperature.value', SpringConfig.min_temperature.value);
	const maxTemperature = op.get<number>(node, 'max_temperature.value', SpringConfig.max_temperature.value);

	return {[SpringConfig.id]: {
		duration,
		precipitationChance,
		windyChance,
		veryWindyChance,
		fishBoost,
		temperature: [minTemperature, maxTemperature],
	}};
};
