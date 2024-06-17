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
import {transformNumeric} from '~/utils/parser/transform';
import {MILESTONES_MIN, MILESTONES_MAX} from '~/utils/scenario/defaults';

/** Convert `scenario` json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformNumeric(json, merge({
    root: 'scenario.required_milestones.value',
    wrapperKey: 'requiredMilestones',
    min: MILESTONES_MIN,
    max: MILESTONES_MAX,
    transform(value: number): number {
      // converts into integer
      return +value.toFixed(0);
    },
  }, options));
};
