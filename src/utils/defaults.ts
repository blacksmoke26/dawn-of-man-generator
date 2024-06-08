/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

export const HUMIDITY_MIN: number = 0;
export const HUMIDITY_MAX: number = 1;
export const HUMIDITY_MIN_DEFAULT: number = 0;
export const HUMIDITY_MAX_DEFAULT: number = 1;

export const ALTITUDE_MIN: number = -20;
export const ALTITUDE_MAX: number = 100;
export const ALTITUDE_MIN_DEFAULT: number = 5;
export const ALTITUDE_MAX_DEFAULT: number = 10;

export const POSITION_MIN: number = 1;
export const POSITION_MAX: number = 2048;

export const ANGLE_MIN: number = -10;
export const ANGLE_MAX: number = 60;
export const ANGLE_MIN_DEFAULT: number = 40;
export const ANGLE_MAX_DEFAULT: number = 55;

export const DENSITY_MIN: number = 0;
export const DENSITY_MAX: number = 1;
export const DENSITY_DEFAULT: number = 1;

export const RESOURCE_FACTOR_MIN: number = 0;
export const RESOURCE_FACTOR_MAX: number = 100;
export const RESOURCE_FACTOR_DEFAULT: number = 1;

export const SEASON_TEMPERATURE_MIN = -50;
export const SEASON_TEMPERATURE_MAX = 100;

export const SEASON_WIND_MIN = 0;
export const SEASON_WIND_MAX = 50;

export const FORD_DISTANCE_FACTOR_MIN: number = 0;
export const FORD_DISTANCE_FACTOR_MAX: number = 20;
export const FORD_DISTANCE_FACTOR_DEFAULT: number = 1;

export const DISTANCE_HEIGHT_OFFSET_MIN: number = 0;
export const DISTANCE_HEIGHT_OFFSET_MAX: number = 20;
export const DISTANCE_HEIGHT_OFFSET_DEFAULT: number = 0.22;

export const SUN_ANGLE_FACTOR_MIN: number = 0;
export const SUN_ANGLE_FACTOR_MAX: number = 20;
export const SUN_ANGLE_FACTOR_DEFAULT: number = 1;

export const PERIOD_MIN: number = 1;
export const PERIOD_MAX: number = 5;

export const DEFAULT_SEASONS: string[] = [
  'Spring',
  'Summer',
  'Fall',
  'Winter',
];

export const DEFAULT_DISASTER: string[] = [
  'Storm',
  'Blizzard',
];
