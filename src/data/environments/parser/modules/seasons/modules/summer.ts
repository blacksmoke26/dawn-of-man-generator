/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';

// helpers
import { isObject } from '~/helpers/object';

// utils
import { SummerConfig } from '~/utils/seasons';

// types
import type {Json} from '~/types/json.types';

/** Convert a season object into redux data */
export const jsonToRedux = ( seasons: Json[] ): Json => {
	const node = seasons.find(s => s.id === SummerConfig.id) as Json | null;

	if ( node === null || !isObject(node) ) {
		return {};
	}

	const duration = op.get<number>(node, 'duration', SummerConfig.duration);
	const precipitationChance = op.get<number>(node, 'precipitation_chance', SummerConfig.precipitation_chance);
	const windyChance = op.get<number>(node, 'windy_chance', SummerConfig.windy_chance);
	const minWind = op.get<number>(node, 'min_wind.value', SummerConfig.min_wind);
	const maxWind = op.get<number>(node, 'max_wind.value', SummerConfig.max_wind);
	const minTemperature = op.get<number>(node, 'min_temperature.value', SummerConfig.min_temperature.value);
	const maxTemperature = op.get<number>(node, 'max_temperature.value', SummerConfig.max_temperature.value);

	return {[SummerConfig.id]: {
		duration,
		precipitationChance,
		windyChance,
		minWind,
		maxWind,
		temperature: [minTemperature, maxTemperature],
	}};
};
