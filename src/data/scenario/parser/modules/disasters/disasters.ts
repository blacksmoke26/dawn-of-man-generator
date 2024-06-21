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
import {DEFAULT_DISASTER} from '~/utils/defaults';
import {validatePeriod} from '~/utils/scenario/validator';
import {transformObjectAttributesArray} from '~/utils/parser/transform';

/** Convert `scenario` json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  const periodAttrs: string[] = ['period', 'variance'];
  const allAttrs: string[] = ['disaster_type', ...periodAttrs];

  return transformObjectAttributesArray(json, merge({
    root: 'scenario.disasters.disaster',
    wrapperKey: 'disasters',
    uniqueKey: 'disaster_type',
    required: allAttrs,
    only: allAttrs,
    minItems: 1,
    maxItems: 2,
    camelKeys: true,
    filterRequired(name: string, value: any): boolean {
      if (name === 'disaster_type' && !DEFAULT_DISASTER.includes(String(value))) {
        return false;
      }
      return !(periodAttrs.includes(name) && !validatePeriod(value));
    },
    transform(name: string, value: any): any {
      return periodAttrs.includes(name) ? parseFloat(String(value)) : value;
    },
  }, options));
};
