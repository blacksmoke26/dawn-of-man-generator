/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

// utils
import {trees} from '~/utils/objects';
import {transformSplitStringArray} from '~/utils/parser/transform';

/** Convert environment json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformSplitStringArray(json, {
    root: 'environment.trees.values',
    wrapperKey: 'trees',
    minItems: 1,
    maxItems: 23,
    unique: true,
    itemsValidator: value => (trees as unknown as string[]).includes(value),
    ...options,
  });
};
