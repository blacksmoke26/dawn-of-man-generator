/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';
import {toFloat} from '~/helpers/number';
import {TIME_ELAPSED} from '~/utils/condition';
import {validatePeriod} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'TimeElapsed';

/** Convert a `TimeElapsed` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  const condition: Json = {type: CONDITION_TYPE};

  if (isString(node?.timer) && TIME_ELAPSED.includes(node?.timer)) {
    condition.timer = node?.timer;
  }

  if (isString(node?.value) && validatePeriod(node?.value, true)) {
    condition.value = toFloat(node?.value);
  }

  return condition;
};
