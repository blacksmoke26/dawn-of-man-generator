/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

export interface SpringSeasonProps {
	duration?: number,
	precipitationChance?: number,
	windyChance?: number,
	veryWindyChance?: number,
	fishBoost?: number,
	minTemperatureValue?: number,
	maxTemperatureValue?: number,
}

export interface SummerSeasonProps {
	duration?: number,
	precipitationChance?: number,
	windyChance?: number,
	minTemperatureValue?: number,
	maxTemperatureValue?: number,
	minWind?: number,
	maxWind?: number,
}

export interface FallSeasonProps {
	duration?: number,
	precipitationChance?: number,
	windyChance?: number,
	veryWindyChance?: number,
	minTemperatureValue?: number,
	maxTemperatureValue?: number,
}

export interface WinterSeasonProps {
	duration?: number,
	precipitationChance?: number,
	windyChance?: number,
	veryWindyChance?: number,
	reducedFauna?: boolean,
	minTemperatureValue?: number,
	maxTemperatureValue?: number,
}

export interface SeasonsProp {
	spring?: SpringSeasonProps,
	summer?: SummerSeasonProps,
	fall?: FallSeasonProps,
	winter?: WinterSeasonProps,
}
