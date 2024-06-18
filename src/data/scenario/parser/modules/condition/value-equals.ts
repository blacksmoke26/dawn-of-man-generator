/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';
import {toFloat} from '~/helpers/number';
import {VALUE_EQUALS} from '~/utils/condition';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'ValueEquals';

/** Convert a `ValueEquals` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  const value = node?.value || null;

  if ((!isString(node?.id) || !VALUE_EQUALS.includes(node?.id))
    || value === null) {
    return null;
  }

  return {
    type: CONDITION_TYPE,
    id: node?.id,
    value: toFloat(value),
  };
};
