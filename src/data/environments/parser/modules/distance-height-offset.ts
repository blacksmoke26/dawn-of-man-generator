/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import {normalizeFloat} from '~/helpers/number';
import {transformNumeric} from '~/utils/parser/transform';
import {DISTANCE_HEIGHT_OFFSET_MAX, DISTANCE_HEIGHT_OFFSET_MIN} from '~/utils/defaults';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

/** Convert environment json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformNumeric(json, {
    root: 'environment.distance_height_offset.value',
    wrapperKey: 'distanceHeightOffset',
    transform(value: number): number {
      return normalizeFloat(value, {
        min: DISTANCE_HEIGHT_OFFSET_MIN,
        max: DISTANCE_HEIGHT_OFFSET_MAX,
        decimals: 2,
      }) as number;
    },
    ...options,
  });
};
