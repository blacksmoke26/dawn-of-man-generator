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
import {validateIndividualDiseaseChance, validatePeriod} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetDiseaseParameters, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetDiseaseParameters';
type ActionParams = ActionWithType<'SetDiseaseParameters', ActionSetDiseaseParameters>;

/** Convert a `SetDiseaseParameters` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  validatePeriod(node?.period) && (action.period = toFloat(node.period, 2));
  validatePeriod(node?.variance) && (action.variance = toFloat(node.variance, 2));

  validateIndividualDiseaseChance(node?.individual_disease_chance)
  && (action.individualDiseaseChance = toFloat(node.individual_disease_chance, 2));

  return action;
};
