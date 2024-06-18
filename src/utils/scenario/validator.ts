/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import {PERIOD_MAX, PERIOD_MIN} from '~/utils/defaults';
import {
  MAP_SIZE_MAX, MAP_SIZE_MIN,
  LOCATION_MAP_MAX, LOCATION_MAP_MIN,
  LOCATION_SEED_MAX, LOCATION_SEED_MIN,
  LOCATION_LAKES_MAX, LOCATION_LAKES_MIN,
  LOCATION_POSITION_MAX, LOCATION_POSITION_MIN,
} from '~/utils/scenario/defaults';
import {isInt} from '~/helpers/number';
import {isString} from '~/helpers/string';

/**
 * Checks if the period is valid
 * @param value The period to validate (e.g., 2.7 or '2.7y')
 * @param [checkUnit] - Checks existence of a `y` unit at the end of the period
 * @returns True if valid, false otherwise
 */
export const validatePeriod = (value: string | number, checkUnit: boolean = true): boolean => {
  let period: number = 0;

  checkUnit && (value = String(value));

  if (typeof value === 'number') {
    period = value;
  }

  if (typeof value === 'string') {
    if (!/^\d+(\.\d+)?y$/ig.test(value)) {
      return false;
    }
    period = Number(parseFloat(value).toFixed(1));
  }

  return !(period < PERIOD_MIN || period > PERIOD_MAX);
};

/**
 * Checks if the map size is valid
 * @param size - The size
 * @returns True if valid, false otherwise
 */
export const validateMapSize = (size: number | any): boolean => {
  return !isInt(size) ? false : !(size < MAP_SIZE_MIN || size > MAP_SIZE_MAX);
};

/**
 * Checks that location seed is valid
 * @param value - The value
 * @returns True if valid, false otherwise
 */
export const validateLocationSeed = (value: number | any): boolean => {
  return !isInt(value) ? false : !(value < LOCATION_SEED_MIN || value > LOCATION_SEED_MAX);
};

/**
 * Checks if the number of lakes (location) is valid
 * @param n - The count
 * @returns True if valid, false otherwise
 */
export const validateLocationLakes = (n: number | any): boolean => {
  return !isInt(n) ? false : !(n < LOCATION_LAKES_MIN || n > LOCATION_LAKES_MAX);
};

/**
 * Checks if the number of lakes (location) is valid
 * @param cord - The coordinates (e.g., '0.1,0.6')
 * @returns True if valid, false otherwise
 */
export const validateLocationCoordinates = (cord: string | any): boolean => {
  if (!isString(cord) || !/^[01]+(\.\d{1,2})?,[01]+(\.\d{1,2})?$/.test(cord)) {
    return false;
  }

  const [x = 0, y = 0] = cord.split(',').map(Number);

  if (x < LOCATION_MAP_MIN || y < LOCATION_MAP_MIN) {
    return false;
  } else if (x > LOCATION_MAP_MAX || y > LOCATION_MAP_MAX) {
    return false;
  }

  return true;
};

/**
 * Checks if the number of lakes (location) is valid
 * @param pos - The position on the map (e.g., '0.,176')
 * @returns True if valid, false otherwise
 */
export const validateLocationPosition = (pos: string | any): boolean => {
  if (!isString(pos) || !/^\d+,\d+$/.test(pos)) {
    return false;
  }

  const [x = 0, y = 0] = pos.split(',').map(Number);

  if (!isInt(x) || !isInt(y)) {
    return false;
  }

  if (x < LOCATION_POSITION_MIN || y < LOCATION_POSITION_MIN) {
    return false;
  } else if (x > LOCATION_POSITION_MAX || y > LOCATION_POSITION_MAX) {
    return false;
  }

  return true;
};
