/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import {normalizeFloat, toFloat} from '~/helpers/number';
import {transformSplitStringArray} from '~/utils/parser/transform';
import {BACKDROP_SCALE_MAX, BACKDROP_SCALE_MIN} from '~/utils/defaults';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

/** Convert environment json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformSplitStringArray(json, {
    root: 'environment.backdrop_scale.value',
    wrapperKey: 'backdropScale',
    splitChar: ',',
    minItems: 3,
    maxItems: 3,
    transformValue(value: string): number {
      return normalizeFloat(toFloat(value), {
        min: BACKDROP_SCALE_MIN, max: BACKDROP_SCALE_MAX, decimals: 2
      }) as number;
    },
    ...options,
  });
};
