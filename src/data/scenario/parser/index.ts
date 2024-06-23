/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import merge from 'deepmerge';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions, ParserCallback} from '~/utils/parser/index.types';

// utils
import {jsonToRedux as j2r1} from './modules/general/hardcore-mode';
import {jsonToRedux as j2r2} from './modules/general/nomad-mode';
import {jsonToRedux as j2r3} from './modules/general/category';
import {jsonToRedux as j2r4} from './modules/general/group-id';
import {jsonToRedux as j2r5} from './modules/general/size';
import {jsonToRedux as j2r6} from './modules/general/show-completion-icon';
import {jsonToRedux as j2r7} from './modules/general/required-scenario';
import {jsonToRedux as j2r8} from './modules/general/required-milestones';
import {jsonToRedux as j2r9} from './modules/general/custom-settlement-name-allowed';
import {jsonToRedux as j2r10} from './modules/general/loading-screens';
import {jsonToRedux as j2r11} from './modules/general/starting-conditions';
import {jsonToRedux as j2r12} from './modules/general/visible';
import {jsonToRedux as j2r13} from './modules/disasters/disasters';
import {jsonToRedux as j2r14} from './modules/locations/locations';
import {jsonToRedux as j2r15} from './modules/milestones/milestones';
import {jsonToRedux as j2r16} from './modules/goals/goals';
import {jsonToRedux as j2r17} from './modules/events/events';

/**
 * @public
 * @static
 * Convert scenario json into redux data */
export function jsonToRedux(json: Json, options: JsonToReduxOptions = {}): Json {
  const parsers: ParserCallback[] = [
    j2r1, j2r2, j2r3, j2r4, j2r5,
    j2r6, j2r7, j2r8, j2r9, j2r10,
    j2r11, j2r12, j2r13, j2r14, j2r15,
    j2r16, j2r17,
  ];

  const outputs: Json[] = [];

  for (const parserFunc of parsers) {
    outputs.push(parserFunc(json, options));
  }

  return {
    scenario: merge.all<Json>(outputs),
  };
}
