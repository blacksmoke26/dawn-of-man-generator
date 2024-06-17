/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import merge from 'deepmerge';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

// utils
import {transformBoolean} from '~/utils/parser/transform';

/** Convert `scenario` json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformBoolean(json, merge({
    root: 'scenario.custom_settlement_name_allowed.value',
    wrapperKey: 'customSettlementNameAllowed',
  }, options));
};
