/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import {snakeCase} from 'change-case';

// helpers
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';

// utils
import {normalizePerformers} from '~/utils/scenario/normalizer-condition';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'AnyTasksActive';

/** Convert a `AnyTasksActive` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if (!isString(node?.task_type, true)) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
    taskType: snakeCase(node?.task_type),
  };

  normalizePerformers(node?.min_performers, num => condition.minPerformers = num);

  return condition;
};
