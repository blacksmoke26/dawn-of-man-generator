/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {toInteger} from '~/helpers/number';
import {
  ENTITY_COUNT_MAX,
  ENTITY_COUNT_MIN,
  PERFORMERS_MAX,
  PERFORMERS_MIN,
  WORKERS_MAX,
  WORKERS_MIN
} from '~/utils/condition';

/** Converts the given value into performers' unit */
export const toPerformers = (value: any): number => {
  const num = toInteger(value, PERFORMERS_MIN);
  return num > PERFORMERS_MAX ? PERFORMERS_MAX : num < PERFORMERS_MIN ? PERFORMERS_MIN : num;
};

/** Converts the given value into performers' unit */
export const toEntityCount = (value: any): number => {
  const num = toInteger(value, ENTITY_COUNT_MIN);
  return num > ENTITY_COUNT_MAX ? ENTITY_COUNT_MAX : num < ENTITY_COUNT_MIN ? ENTITY_COUNT_MIN : num;
};

/** Converts the given value into performers' unit */
export const toWorkers = (value: any): number => {
  const num = toInteger(value, WORKERS_MIN);
  return num > WORKERS_MAX ? WORKERS_MAX : num < WORKERS_MIN ? WORKERS_MIN : num;
};
