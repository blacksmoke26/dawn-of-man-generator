/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import {snakeCase} from 'change-case';

// helpers
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'IsAlive';

/** Convert a `IsAlive` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  return !isString(node?.name, true) ? null : {
    type: CONDITION_TYPE,
    name: snakeCase(node?.name),
  };
};
