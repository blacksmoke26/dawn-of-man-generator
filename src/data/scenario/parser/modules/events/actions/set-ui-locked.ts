/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isString} from '~/helpers/string';
import {isObject} from '~/helpers/object';
import {LOCK_FLAGS} from '~/utils/action';

// validators
// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetUiLocked, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetUiLocked';
type ActionParams = ActionWithType<'SetUiLocked', ActionSetUiLocked>;

/** Convert a `SetUiLocked` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  (isString(node?.lock_flags, true) && LOCK_FLAGS.includes(node.lock_flags))
  && (action.lockFlags = node.lock_flags);

  return action;
};
