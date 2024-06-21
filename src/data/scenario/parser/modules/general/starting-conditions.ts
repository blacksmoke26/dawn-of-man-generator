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
import {transformObjectAttributes} from '~/utils/parser/transform';
import {DEFAULT_SEASONS} from '~/utils/defaults';

/** Convert `scenario` json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return transformObjectAttributes(json, merge({
    root: 'scenario.starting_conditions',
    wrapperKey: 'startingConditions',
    required: ['season_id'],
    only: ['season_id', 'visual_setup_id'],
    camelKeys: true,
    filterRequired(name: string, value: string): boolean {
      return !(name === 'season_id' && !DEFAULT_SEASONS.includes(value));
    },
  }, options));
};
