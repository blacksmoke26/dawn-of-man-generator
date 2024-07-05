/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {toFloat} from '~/helpers/number';
import {isObject} from '~/helpers/object';
import {validateTechCostMultiplier} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetKnowledgeParameters, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetKnowledgeParameters';
type ActionParams = ActionWithType<'SetKnowledgeParameters', ActionSetKnowledgeParameters>;

/** Convert a `SetKnowledgeParameters` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  if (validateTechCostMultiplier(node?.tech_cost_multiplier)) {
    action.techCostMultiplier = toFloat(node?.tech_cost_multiplier, 2);
  }

  return action;
};
