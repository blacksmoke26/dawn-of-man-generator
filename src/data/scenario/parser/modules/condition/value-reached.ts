/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';
import {isInt} from '~/helpers/number';
import {VALUE_REACHED} from '~/utils/condition';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'ValueReached';

/** Convert a `ValueReached` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if ((!isString(node?.id) || !VALUE_REACHED.includes(node?.id))) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
    id: node?.id,
  };

  if (isInt(node?.value) && node?.value >= 0) {
    condition.value = node?.value;
  }

  return condition;
};
