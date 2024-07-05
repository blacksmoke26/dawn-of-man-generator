/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isNumeric, toInteger} from '~/helpers/number';
import {isInList} from '~/helpers/array';
import {isObject} from '~/helpers/object';
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

  if (!isInList(node?.id, VALUE_REACHED)) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
    id: node?.id,
  };

  isNumeric(node?.value) && (condition.value = toInteger(node?.value));

  return condition;
};
