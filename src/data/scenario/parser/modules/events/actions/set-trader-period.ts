/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isObject} from '~/helpers/object';
import {toFloat} from '~/helpers/number';

// validators
import {validatePeriod} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetTraderPeriod, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetTraderPeriod';
type ActionParams = ActionWithType<'SetTraderPeriod', ActionSetTraderPeriod>;

/** Convert a `SetTraderPeriod` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  validatePeriod(node?.value) && (action.value = toFloat(node.value, 2));

  return action;
};
