/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isInList} from '~/helpers/array';
import {isObject} from '~/helpers/object';
import {TIME_ELAPSED} from '~/utils/condition';

// utils
import {normalizePeriod} from '~/utils/scenario/normalizer-condition';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'TimeElapsed';

/** Convert a `TimeElapsed` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE
  };

  isInList(node?.timer, TIME_ELAPSED, value => condition.timer = value);

  normalizePeriod(node?.value, value => condition.value = value);

  return Object.keys(condition).length === 1
    ? null
    : condition;
};
