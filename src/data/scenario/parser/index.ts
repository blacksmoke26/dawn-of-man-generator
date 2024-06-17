/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {mergeAll} from '~/helpers/object';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

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

/**
 * @public
 * @static
 * Convert scenario json into redux data */
export function jsonToRedux(json: Json, options: JsonToReduxOptions = {}): Json {
  const scenario: Json = mergeAll<Json>(
    j2r1(json, options), j2r2(json, options), j2r3(json, options),
    j2r4(json, options), j2r5(json, options), j2r6(json, options),
    j2r7(json, options), j2r8(json, options), j2r9(json, options),
    j2r10(json, options), j2r11(json, options), j2r12(json, options),
    j2r13(json, options), j2r14(json, options),
  );

  return {scenario};
}
