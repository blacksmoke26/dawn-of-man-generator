/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {toFloat} from '~/helpers/number';
import {isObject} from '~/helpers/object';

// validators
import {validateRaiderAttackAmount} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionTriggerRaiderAttack, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'TriggerRaiderAttack';
type ActionParams = ActionWithType<'TriggerRaiderAttack', ActionTriggerRaiderAttack>;

/** Convert a `TriggerRaiderAttack` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  validateRaiderAttackAmount(node?.amount) && (action.amount = toFloat(node.amount, 2));

  return action;
};
