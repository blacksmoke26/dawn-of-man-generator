/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-14
 * @version 2.6.0
 */

// helpers
import {Callable, isInt, isNumeric, normalizeFloat, normalizeInt} from '~/helpers/number';

// utils
import * as Defaults from '~/utils/defaults';
//import * as ScnDefaults from '~/utils/scenario/defaults';
import * as CondDefaults from '~/utils/condition';

// validators
import {isVectorPosition} from '~/utils/scenario/validator';

export const normalizeRadius = (value: number | any, callback?: Callable<number>): false | number => {
  if (!isNumeric(value))
    return false;

  return normalizeFloat(+value, {
    min: Defaults.RADIUS_MIN, max: Defaults.RADIUS_MAX, callback, decimals: 2,
  });
};

export const normalizeDistance = (value: number | any, callback?: Callable<number>): false | number => {
  if (!isNumeric(value))
    return false;

  return normalizeFloat(+value, {
    min: CondDefaults.DISTANCE_MIN, max: CondDefaults.DISTANCE_MAX, callback, decimals: 2,
  });
};

export const normalizeRotation = (value: number | any, callback?: Callable<number>): false | number => {
  if (!isNumeric(value))
    return false;

  return normalizeFloat(+value, {
    min: Defaults.ROTATION_MIN, max: Defaults.ROTATION_MAX, callback, decimals: 2,
  });
};

export const normalizeLocationIndex = (value: any, callback?: Callable<number>): false | number => {
  if (!isInt(value)) {
    return false;
  }

  return normalizeInt(+value, {
    min: Defaults.LOCATION_INDEX_MIN, max: Defaults.LOCATION_INDEX_MAX, callback,
  });
};

export const normalizeVectorPosition = (value: any, callback?: Callable<[number, number, number]>): false | [number, number, number] => {
  if (!isVectorPosition(value)) {
    return false;
  }

  const position = value.split(',').map((val: string) => normalizeInt(+val, {
    min: Defaults.POSITION_VECTOR_MIN, max: Defaults.POSITION_VECTOR_MAX,
  }));

  callback && callback?.(position);

  return position;
};
