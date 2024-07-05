/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isBool} from '~/helpers/bool';
import {isObject} from '~/helpers/object';

// types
import type {Json} from '~/types/json.types';
import type {ActionQuitGame, ActionName, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'QuitGame';
type ActionParams = ActionWithType<'QuitGame', ActionQuitGame>;

/** Convert a `QuitGame` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  isBool(node?.success) && (action.success = node?.success);

  return action;
};
