/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isObject} from '~/helpers/object';
import {validateTimeScale} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetTimeScale, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetTimeScale';
type ActionParams = ActionWithType<'SetTimeScale', ActionSetTimeScale>;

/** Convert a `SetTimeScale` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  if (validateTimeScale(node?.value)) {
    action.index = node?.value;
  }

  return action;
};
