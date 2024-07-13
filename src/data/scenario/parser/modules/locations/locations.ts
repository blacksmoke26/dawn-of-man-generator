/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import merge from 'deepmerge';
import {snakeCase} from 'change-case';

// utils
import {isBool} from '~/helpers/bool';
import {isInt} from '~/helpers/number';
import {isString} from '~/helpers/string';
import {transformObjectAttributesArray} from '~/utils/parser/transform';
import {LOCATION_COUNT_MAX, LOCATION_COUNT_MIN} from '~/utils/scenario/defaults';
import {isLocationCoordinates, isLocationPosition} from '~/utils/scenario/validator';
import {
  normalizeSeed,
  normalizeLakes,
  normalizePosition,
  normalizeCoordinates,
} from '~/utils/scenario/normalizer-location';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

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

const transform = (name: string, value: any): any => {
  switch (name) {
    case 'seed':
      return normalizeSeed(value);
    case 'id':
    case 'environment':
      return snakeCase(value);
    case 'map_location':
      return normalizeCoordinates(value);
    case 'position':
      return normalizePosition(value);
    case 'lakes':
      return normalizeLakes(value);
    default:
      return value;
  }
};

const filterRequired = (name: string, value: any): boolean | undefined => {
  if (['id', 'environment'].includes(name) && !isString(value, true)) {
    return false;
  } else if (name === 'seed' && !isInt(value)) {
    return false;
  } else if (name === 'map_location' && !isLocationCoordinates(value, true)) {
    return false;
  } else if (name === 'position' && !isLocationPosition(value)) {
    return undefined;
  } else if (name === 'lakes' && !isInt(value)) {
    return undefined;
  }
  if (name === 'river' && !isBool(value)) {
    return undefined;
  }
  
  return true;
};
