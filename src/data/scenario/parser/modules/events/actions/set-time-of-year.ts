/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {toFloat} from '~/helpers/number';
import {isObject} from '~/helpers/object';
import {validateTimeOfYear} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetTimeOfYear, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetTimeOfYear';
type ActionParams = ActionWithType<'SetTimeOfYear', ActionSetTimeOfYear>;

/** Convert a `SetTimeOfYear` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  validateTimeOfYear(node?.value)
  && (action.value = toFloat(node?.value, 1));

  return action;
};
