/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// utils
import {Callable, normalizeFloat, normalizeInt} from '~/helpers/number';

// condition utils
import {
  DISTANCE_MAX,
  DISTANCE_MIN,
  ENTITY_COUNT_MAX,
  ENTITY_COUNT_MIN,
  PERFORMERS_MAX,
  PERFORMERS_MIN,
  WORKERS_MAX,
  WORKERS_MIN,
} from '~/utils/condition';
import {PERIOD_MAX, PERIOD_MIN} from '~/utils/defaults';

/**
 * Normalize performers value
 * @returns The value, false if invalid
 */
export const normalizePerformers = (value: number | any, callback?: Callable<number>): false | number => {
  return normalizeInt(value, {
    min: PERFORMERS_MIN, max: PERFORMERS_MAX, callback,
  });
};

/**
 * Normalize workers value
 * @returns The value, false if invalid
 */
export const normalizeWorkers = (value: number | any, callback?: Callable<number>): false | number => {
  return normalizeInt(value, {
    min: WORKERS_MIN, max: WORKERS_MAX, callback,
  });
};

/**
 * Normalize entity count value
 * @returns The value, false if invalid
 */
export const normalizeEntityCount = (value: number | any, callback?: Callable<number>): false | number => {
  return normalizeInt(value, {
    min: ENTITY_COUNT_MIN, max: ENTITY_COUNT_MAX, callback,
  });
};

/**
 * Normalize distance value
 * @returns The value, false if invalid
 */
export const normalizeDistance = (value: number | any, callback?: Callable<number>): false | number => {
  return normalizeFloat(value, {
    min: DISTANCE_MIN, max: DISTANCE_MAX, callback, decimals: 2,
  });
};

/**
 * Normalize period value
 * @returns The value, false if invalid
 */
export const normalizePeriod = (value: number | any, callback?: Callable<number>): false | number => {
  return normalizeFloat(value, {
    min: PERIOD_MIN, max: PERIOD_MAX, callback, decimals: 2,
  });
};
