/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// utils
import {normalizeFloat, normalizeInt, normalizeMinMaxRange} from '~/helpers/number';

// condition utils
import {
  SEASON_DURATION_MAX,
  SEASON_DURATION_MIN,
  SEASON_FISH_BOOST_MAX,
  SEASON_FISH_BOOST_MIN,
  SEASON_PRECIPITATION_CHANCE_MAX,
  SEASON_PRECIPITATION_CHANCE_MIN, SEASON_TEMPERATURE_MAX, SEASON_TEMPERATURE_MIN,
  SEASON_VERY_WINDY_CHANCE_MAX,
  SEASON_VERY_WINDY_CHANCE_MIN, SEASON_WIND_MAX, SEASON_WIND_MIN,
  SEASON_WINDY_CHANCE_MAX,
  SEASON_WINDY_CHANCE_MIN,
} from '~/utils/defaults';

/**
 * Normalize duration (season) value
 * @returns Normalized value
 */
export const normalizeSeasonDuration = (value: number | any, defaultValue = 0): number => {
  return normalizeFloat(value, {
    min: SEASON_DURATION_MIN,
    max: SEASON_DURATION_MAX,
    decimals: 2,
  }) || defaultValue;
};

/**
 * Normalize precipitation chance (season) value
 * @returns Normalized value
 */
export const normalizeSeasonPrecipitationChance = (value: number | any, defaultValue = 0): number => {
  return normalizeFloat(value, {
    min: SEASON_PRECIPITATION_CHANCE_MIN,
    max: SEASON_PRECIPITATION_CHANCE_MAX,
    decimals: 2,
  }) || defaultValue;
};

/**
 * Normalize windy chance (season) value
 * @returns Normalized value
 */
export const normalizeSeasonWindyChance = (value: number | any, defaultValue = 0): number => {
  return normalizeFloat(value, {
    min: SEASON_WINDY_CHANCE_MIN,
    max: SEASON_WINDY_CHANCE_MAX,
    decimals: 2,
  }) || defaultValue;
};

/**
 * Normalize very windy chance (season) value
 * @returns Normalized value
 */
export const normalizeSeasonVeryWindyChance = (value: number | any, defaultValue = 0): number => {
  return normalizeFloat(value, {
    min: SEASON_VERY_WINDY_CHANCE_MIN,
    max: SEASON_VERY_WINDY_CHANCE_MAX,
    decimals: 2,
  }) || defaultValue;
};

/**
 * Normalize fish boost (season) value
 * @returns Normalized value
 */
export const normalizeSeasonFishBoost = (value: number | any, defaultValue = 0): number => {
  return normalizeFloat(value, {
    min: SEASON_FISH_BOOST_MIN,
    max: SEASON_FISH_BOOST_MAX,
    decimals: 2,
  }) || defaultValue;
};


/**
 * Normalize temperature (season) value
 * @returns Normalized value
 */
export const normalizeSeasonTemperature = (value: number | any, defaultValue = 0): number => {
  return normalizeInt(value, {
    min: SEASON_TEMPERATURE_MIN,
    max: SEASON_TEMPERATURE_MAX,
  }) || defaultValue;
};

/**
 * Normalize temperature (season) value
 * @returns Normalized value
 */
export const normalizeSeasonTemperatureMinMax = (args: {
  min: number,
  max: number,
  minDefault: number,
  maxDefault: number
}): [number, number] => {
  const tempMin = normalizeSeasonTemperature(args.min, args.minDefault);
  const tempMax = normalizeSeasonTemperature(args.max, args.maxDefault);
  return normalizeMinMaxRange(tempMin, tempMax);
};

/**
 * Normalize wind speed (season) value
 * @returns Normalized value
 */
export const normalizeSeasonWind = (value: number | any, defaultValue = 0): number => {
  return normalizeInt(value, {
    min: SEASON_WIND_MIN,
    max: SEASON_WIND_MAX,
  }) || defaultValue;
};

/**
 * Normalize temperature (season) value
 * @returns Normalized value
 */
export const normalizeSeasonWindMinMax = (args: {
  min: number,
  max: number,
  minDefault: number,
  maxDefault: number
}): [number, number] => {
  const tempMin = normalizeSeasonWind(args.min, args.minDefault);
  const tempMax = normalizeSeasonWind(args.max, args.maxDefault);
  return normalizeMinMaxRange(tempMin, tempMax);
};
