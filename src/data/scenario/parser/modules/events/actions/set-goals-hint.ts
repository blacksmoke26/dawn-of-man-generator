/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import {snakeCase} from 'change-case';

// utils
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';

// types
import type {Json} from '~/types/json.types';
import type {ActionSetGoalsHint, ActionName, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetGoalsHint';
type ActionParams = ActionWithType<'SetGoalsHint', ActionSetGoalsHint>;

/** Convert a `SetGoalsHint` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  return !isString(node?.value, true) ? null : {
    type: ACTION_NAME,
    value: snakeCase(node.value),
  } as ActionParams;
};
