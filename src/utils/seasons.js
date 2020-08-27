// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-27
 */

// Utils
import * as random from './random';

export type SpringSeasonProps = {
	duration: number,
	precipitationChance: number,
	windyChance: number,
	veryWindyChance: number,
	fishBoost: number,
	minTemperatureValue: number,
	maxTemperatureValue: number,
}

export type SummerSeasonProps = {
	duration: number,
	precipitationChance: number,
	windyChance: number,
	minTemperatureValue: number,
	maxTemperatureValue: number,
}

export type FallSeasonProps = {
	duration: number,
	precipitationChance: number,
	windyChance: number,
	veryWindyChance: number,
	minTemperatureValue: number,
	maxTemperatureValue: number,
}

export type WinterSeasonProps = {
	duration: number,
	precipitationChance: number,
	windyChance: number,
	veryWindyChance: number,
	reducedFauna: boolean,
	minTemperatureValue: number,
	maxTemperatureValue: number,
}

export type SeasonsProp = {
	spring: SpringSeasonProps,
	summer: SummerSeasonProps,
	fall: FallSeasonProps,
	winter: WinterSeasonProps,
};

export const SpringConfig: Object = {
	id: 'Spring',
	setup_id: 'Spring',
	duration: 0.25,
	precipitation_chance: 0.25,
	windy_chance: 0.5,
	very_windy_chance: 0.1,
	fish_boost: 0.5,
	min_temperature: {
		value: 5,
	},
	max_temperature: {
		value: 25,
	},
};

export const SummerConfig: Object = {
	id: 'Summer',
	setup_id: 'Summer',
	duration: 0.25,
	precipitation_chance: 0.0,
	windy_chance: 0.25,
	min_temperature: {
		value: 20,
	},
	max_temperature: {
		value: 35,
	},
};

export const FallConfig: Object = {
	id: 'Fall',
	setup_id: 'Fall',
	duration: 0.25,
	precipitation_chance: 0.25,
	windy_chance: 0.5,
	very_windy_chance: 0.1,
	min_temperature: {
		value: 5,
	},
	max_temperature: {
		value: 25,
	},
};

export const WinterConfig: Object = {
	id: 'Winter',
	setup_id: 'Winter',
	snow_setup_id: 'WinterSnow',
	duration: 0.25,
	precipitation_chance: 0.25,
	windy_chance: 0.5,
	very_windy_chance: 0.1,
	reduced_fauna: true,
	min_temperature: {
		value: -15,
	},
	max_temperature: {
		value: 10,
	},
};

/**
 * @public
 * @static
 * Get all seasons default attributes */
export function seasonsPropsDefault (): SeasonsProp {
	return {
		spring: {
			duration: SpringConfig.duration,
			precipitationChance: SpringConfig.precipitation_chance,
			windyChance: SpringConfig.windy_chance,
			veryWindyChance: SpringConfig.very_windy_chance,
			fishBoost: SpringConfig.fish_boost,
			minTemperatureValue: SpringConfig.min_temperature.value,
			maxTemperatureValue: SpringConfig.max_temperature.value,
		},
		summer: {
			duration: SummerConfig.duration,
			precipitationChance: SummerConfig.precipitation_chance,
			windyChance: SummerConfig.windy_chance,
			minTemperatureValue: SummerConfig.min_temperature.value,
			maxTemperatureValue: SummerConfig.max_temperature.value,
		},
		fall: {
			duration: FallConfig.duration,
			precipitationChance: FallConfig.precipitation_chance,
			windyChance: FallConfig.windy_chance,
			veryWindyChance: FallConfig.very_windy_chance,
			minTemperatureValue: FallConfig.min_temperature.value,
			maxTemperatureValue: FallConfig.max_temperature.value,
		},
		winter: {
			duration: WinterConfig.duration,
			precipitationChance: WinterConfig.precipitation_chance,
			windyChance: WinterConfig.windy_chance,
			veryWindyChance: WinterConfig.very_windy_chance,
			reducedFauna: WinterConfig.reduced_fauna,
			minTemperatureValue: WinterConfig.min_temperature.value,
			maxTemperatureValue: WinterConfig.max_temperature.value,
		},
	};
}

/**
 * @public
 * @static
 * Randomize spring values */
export function randomizeSpring (): SpringSeasonProps {
	const [minTemperatureValue, maxTemperatureValue] = random.randomSeasonTemperature();
	return {
		duration: random.randomFloat(),
		precipitationChance: random.randomFloat(),
		windyChance: random.randomFloat(),
		veryWindyChance: random.randomFloat(),
		fishBoost: random.randomFloat(),
		minTemperatureValue, maxTemperatureValue,
	};
}

/**
 * @public
 * @static
 * Randomize summer values */
export function randomizeSummer (): SummerSeasonProps {
	const [minTemperatureValue, maxTemperatureValue] = random.randomSeasonTemperature();
	return {
		duration: random.randomFloat(),
		precipitationChance: random.randomFloat(),
		windyChance: random.randomFloat(),
		minTemperatureValue, maxTemperatureValue,
	}
}

/**
 * @public
 * @static
 * Randomize fall values */
export function randomizeFall (): FallSeasonProps {
	const [minTemperatureValue, maxTemperatureValue] = random.randomSeasonTemperature();
	return {
		duration: random.randomFloat(),
		precipitationChance: random.randomFloat(),
		windyChance: random.randomFloat(),
		veryWindyChance: random.randomFloat(),
		minTemperatureValue, maxTemperatureValue,
	};
}

/**
 * @public
 * @static
 * Randomize winter values */
export function randomizeWinter (): WinterSeasonProps {
	const [minTemperatureValue, maxTemperatureValue] = random.randomSeasonTemperature();
	return {
		duration: random.randomFloat(),
		precipitationChance: random.randomFloat(),
		windyChance: random.randomFloat(),
		veryWindyChance: random.randomFloat(),
		reducedFauna: random.randomArray([true, false], 1)[0],
		minTemperatureValue, maxTemperatureValue,
	};
}

/**
 * @public
 * @static
 * Randomize all seasons attributes */
export function seasonsPropsRandomize (): SeasonsProp {
	return {
		spring: randomizeSpring(),
		summer: randomizeSummer(),
		fall: randomizeFall(),
		winter: randomizeWinter(),
	}
}
