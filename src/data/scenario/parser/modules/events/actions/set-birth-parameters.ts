/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isObject} from '~/helpers/object';

// validators
import {validateDecreaseHalfingPopulation, validateDecreaseStartPopulation} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetBirthParameters, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetBirthParameters';
type ActionParams = ActionWithType<'SetBirthParameters', ActionSetBirthParameters>;

/** Convert a `SetBirthParameters` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  validateDecreaseStartPopulation(node?.decrease_start_population)
  && (action.decreaseStartPopulation = node.decrease_start_population);

  validateDecreaseHalfingPopulation(node?.decrease_halfing_population)
  && (action.decreaseHalfingPopulation = node.decrease_halfing_population);

  return action;
};
