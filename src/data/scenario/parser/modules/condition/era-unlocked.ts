/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {ERAS} from '~/utils/condition';
import {isInList} from '~/helpers/array';
import {isObject} from '~/helpers/object';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'EraUnlocked';

/** Convert a `EraUnlocked` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if (!isInList(node?.era, ERAS)) {
    return null;
  }

  return {
    type: CONDITION_TYPE,
    era: node?.era,
  };
};
