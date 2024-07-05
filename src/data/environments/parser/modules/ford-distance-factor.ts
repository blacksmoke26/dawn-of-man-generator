/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import {normalizeFloat} from '~/helpers/number';
import {transformNumeric} from '~/utils/parser/transform';
import {FORD_DISTANCE_FACTOR_MAX, FORD_DISTANCE_FACTOR_MIN} from '~/utils/defaults';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

/** Convert environment json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformNumeric(json, {
    root: 'environment.ford_distance_factor.value',
    wrapperKey: 'fordDistanceFactor',
    transform(value: number): number {
      return normalizeFloat(value, {
        min: FORD_DISTANCE_FACTOR_MIN,
        max: FORD_DISTANCE_FACTOR_MAX,
        decimals: 2,
      }) as number;
    },
    ...options,
  });
};
