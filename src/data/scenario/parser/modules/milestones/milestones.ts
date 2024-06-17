/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

//import merge from 'deepmerge';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

// utils
//import {transformObjectAttributesArray} from '~/utils/parser/transform';

/*const transform = (name: string, value: any): any => {
  return value;
};

const filterRequired = (name: string, value: any): boolean => {
  return true;
};*/

/** Convert `scenario` json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  return {};
  // TODO: Implement logic here

  /*return transformObjectAttributesArray(json, merge({
    root: 'scenario.milestones.milestone',
    wrapperKey: 'milestones',
    uniqueKey: 'id',
    required: ['id'],
    only: ['id'],
    minItems: 1,
    filterRequired,
    transform,
  }, options));*/
};
