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
import {normalizeWorkers} from '~/utils/scenario/normalizer-condition';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'AnyWorkAreasActive';

/** Convert a `AnyWorkAreasActive` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if (!isString(node?.work_area_id, true)) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
    workAreaId: snakeCase(node?.work_area_id),
  };

  normalizeWorkers(node?.max_workers, num => condition.maxWorkers = num);

  return condition;
};
