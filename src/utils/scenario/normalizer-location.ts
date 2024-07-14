/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// utils
import {Callable, normalizeFloat, normalizeInt} from '~/helpers/number';

// validators
import {isLocationCoordinates, isLocationPosition} from '~/utils/scenario/validator';
import {
  LOCATION_LAKES_MAX,
  LOCATION_LAKES_MIN,
  LOCATION_MAP_MAX,
  LOCATION_MAP_MIN,
  LOCATION_POSITION_MAX,
  LOCATION_POSITION_MIN,
  LOCATION_SEED_MAX,
  LOCATION_SEED_MIN,
} from '~/utils/scenario/defaults';

/**
 * Normalize seed value
 * @returns The value, false if invalid
 */
export const normalizeSeed = (value: number | any, callback?: Callable<number>): false | number => {
  return normalizeInt(value, {
    min: LOCATION_SEED_MIN, max: LOCATION_SEED_MAX, callback,
  });
};

/**
 * Normalize lakes value
 * @returns The value, false if invalid
 */
export const normalizeLakes = (value: number | any, callback?: Callable<number>): false | number => {
  return normalizeInt(value, {
    min: LOCATION_LAKES_MIN, max: LOCATION_LAKES_MAX, callback,
  });
};

/**
 * Normalize coordinates value
 * @returns The value, false if invalid
 */
export const normalizeCoordinates = (position: string, callback?: Callable<number>): false | [number, number] => {
  if (!isLocationCoordinates(position, true)) return false;

  return position.split(',')
    .map((value: string) => {
      return normalizeFloat(+value, {
        min: LOCATION_MAP_MIN, max: LOCATION_MAP_MAX, callback, decimals: 3,
      });
    }) as [number, number];
};

/**
 * Normalize position value
 * @returns The value, false if invalid
 */
export const normalizePosition = (position: string, callback?: Callable<[number, number]>): false | [number, number] => {
  if (!isLocationPosition(position)) return false;

  const value = position.split(',').map((value: string) => normalizeInt(value, {
    min: LOCATION_POSITION_MIN, max: LOCATION_POSITION_MAX,
  })) as [number, number];

  callback && callback?.(value);

  return value;
};
