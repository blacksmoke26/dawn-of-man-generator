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

const CONDITION_TYPE: GeneralCondition = 'AnyWorkAreasActive';

/** Convert a `AnyWorkAreasActive` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if (!isString(node?.work_area_id) || !node?.work_area_id.trim()) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
    workAreaId: node?.work_area_id.trim(),
  };

  if (node?.max_workers && isInt(node?.max_workers) && node?.max_workers >= 0) {
    condition.maxWorkers = node?.max_workers;
  }

  return condition;
};
