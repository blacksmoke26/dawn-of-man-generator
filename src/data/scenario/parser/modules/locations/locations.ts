/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import merge from 'deepmerge';
import {snakeCase} from 'change-case';

// utils
import {isBool} from '~/helpers/bool';
import {transformObjectAttributesArray} from '~/utils/parser/transform';
import {LOCATION_COUNT_MIN, LOCATION_COUNT_MAX} from '~/utils/scenario/defaults';
import {
  validateLocationSeed,
  validateLocationLakes,
  validateLocationPosition,
  validateLocationCoordinates,
} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

const transform = (name: string, value: any): any => {
  if ('seed' === name) {
    return Number(value).toFixed(0).padStart(9, '0');
  }

  if (['id', 'environment'].includes(name)) {
    return snakeCase(value);
  }

  if (['map_location', 'position'].includes(name)) {
    return String(value).split(',').map(Number);
  }

  if ('lakes' === name) {
    return +Number(value).toFixed(0);
  }

  return value;
};

const filterRequired = (name: string, value: any): boolean => {
  if (['id', 'environment'].includes(name) && (!value.trim() || value.length < 3)) {
    return false;
  } else if ( name === 'seed' && !validateLocationSeed(value)) {
    return false;
  } else if ( name === 'map_location' && !validateLocationCoordinates(value)) {
    return false;
  } else if ( name === 'position' && !validateLocationPosition(value)) {
    return false;
  } else if ( name === 'lakes' && !validateLocationLakes(value)) {
    return false;
  }

  return !(name === 'river' && !isBool(value));
};

/** Convert `scenario` json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  const required: string[] = ['id', 'seed', 'environment', 'map_location'];
  const only: string[] = [...required, 'position', 'river', 'lakes'];

  return transformObjectAttributesArray(json, merge({
    root: 'scenario.locations.location',
    wrapperKey: 'locations',
    uniqueKey: 'id',
    required,
    only,
    minItems: LOCATION_COUNT_MIN,
    maxItems: LOCATION_COUNT_MAX,
    filterRequired,
    transform,
    camelKeys: true,
  }, options));
};
