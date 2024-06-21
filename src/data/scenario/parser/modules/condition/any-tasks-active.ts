/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isInt} from '~/helpers/number';
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'AnyTasksActive';

/** Convert a `AnyTasksActive` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if ((!isString(node?.task_type) || !node?.task_type.trim())) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
    task_type: node?.task_type.trim(),
  };

  if (isInt(node?.min_performers) && node?.min_performers >= 0) {
    condition.minPerformers = node?.min_performers;
  }

  return condition;
};
