/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-05
 * @version 2.5.0
 */

// utils
import {
  ALTITUDE_MAX,
  ALTITUDE_MIN,
  ANGLE_MAX,
  ANGLE_MIN,
  DENSITY_MAX,
  DENSITY_MIN,
  HUMIDITY_MAX,
  HUMIDITY_MIN,
} from '~/utils/defaults';
import {normalizeMinMax, toFloat, toInteger} from '~/helpers/number';

// types
import type {Json} from '~/types/json.types';

class NumberType {
  constructor(public value: number, public id: string) {
  }
}

export const populateMinMaxObject = (obj: Json, options: PopulateMinMaxOptions): Json => {
  const {property} = options;

  const data = {...obj};

  if (!(property in data)) {
    return options?.setWhenEmpty ? {[property]: [options.min, options.max]} : {};
  }

  const value = data[property] as NumberType[];

  let values: number[] = [];

  if (value.length === 1) {
    value[0].id === 'min' && (values = [value[0].value, options.max]);
    value[0].id === 'max' && (values = [options.min, value[0].value]);
  } else {
    values = [value[0].value, value[1].value];
  }

  values[0] > values[1] && (values[0] = values[1]);
  values[1] < values[0] && (values[1] = values[0]);

  return {[property]: values};
};

export const transformPrototypesPropertyValue = (key: string, value: number): any => {
  const id = key.replace(/_.+$/, '');

  switch (key) {
    case 'density':
      return normalizeMinMax(toFloat(value, 2), {min: DENSITY_MIN, max: DENSITY_MAX});
    case 'min_altitude':
    case 'max_altitude':
      return new NumberType(normalizeMinMax(toInteger(value), {min: ALTITUDE_MIN, max: ALTITUDE_MAX}), id);
    case 'min_humidity':
    case 'max_humidity':
      return new NumberType(normalizeMinMax(toFloat(value, 2), {min: HUMIDITY_MIN, max: HUMIDITY_MAX}), id);
    case 'min_angle':
    case 'max_angle':
      return new NumberType(normalizeMinMax(toInteger(value), {min: ANGLE_MIN, max: ANGLE_MAX}), id);
    default:
      return value;
  }
};

export const transformObjectOutput = (obj: Json): Json => {
  return {
    ...obj,
    ...populateMinMaxObject(obj, {
      property: 'altitude',
      min: ALTITUDE_MIN,
      max: ALTITUDE_MAX,
    }),
    ...populateMinMaxObject(obj, {
      property: 'humidity',
      min: HUMIDITY_MIN,
      max: HUMIDITY_MAX,
    }),
    ...populateMinMaxObject(obj, {
      property: 'angle',
      min: ANGLE_MIN,
      max: ANGLE_MAX,
    }),
  };
};

interface PopulateMinMaxOptions {
  property: string;
  min: number;
  max: number;
  setWhenEmpty?: boolean;
}
