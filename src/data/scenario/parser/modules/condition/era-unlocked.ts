/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {ERAS} from '~/utils/condition';
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'EraUnlocked';

/** Convert a `EraUnlocked` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if (!isString(node?.era) || !ERAS.includes(node?.era)) {
    return null;
  }

  return {
    type: CONDITION_TYPE,
    era: node?.era,
  };
};
