/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import merge from 'deepmerge';
import {snakeCase} from 'change-case';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

// utils
import {transformString} from '~/utils/parser/transform';

/** Convert `scenario` json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformString(json, merge({
    root: 'scenario.group_id.value',
    wrapperKey: 'groupId',
    transform(value: string): string {
      return snakeCase(value).replace(/_+/ig, '_');
    },
  }, options));
};
