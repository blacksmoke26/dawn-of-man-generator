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
import type {ActionSetGoal, ActionName, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetGoal';
type ActionParams = ActionWithType<'SetGoal', ActionSetGoal>;

/** Convert a `SetGoal` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  return !isString(node?.id, true) ? null : {
    type: ACTION_NAME,
    id: snakeCase(node.id),
  } as ActionParams;
};
