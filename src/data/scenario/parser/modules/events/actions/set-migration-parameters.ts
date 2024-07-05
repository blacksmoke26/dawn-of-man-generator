/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isObject} from '~/helpers/object';
import {isInt, toFloat} from '~/helpers/number';
import {
  validatePeriod,
  validateDecreaseStartPopulation,
  validateDecreaseHalfingPopulation,
} from '~/utils/scenario/validator';
import {ENTITY_COUNT_MAX, ENTITY_COUNT_MIN} from '~/utils/condition';

// validators
// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetMigrationParameters, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetMigrationParameters';
type ActionParams = ActionWithType<'SetMigrationParameters', ActionSetMigrationParameters>;

const normalizeValues = (node: Json, action: ActionParams): ActionParams => {
  (isInt(node?.min) && node.min >= ENTITY_COUNT_MIN) && (action.min = node.min);
  (isInt(node?.max) && node.max <= ENTITY_COUNT_MAX) && (action.max = node.max);

  if (action?.min !== undefined && action?.max !== undefined) {
    action?.min > action.max && (action.min = action.max);
    action?.max < action.min && (action.max = action.min);
  }

  validatePeriod(node?.period) && (action.period = toFloat(node.period, 2));

  validateDecreaseStartPopulation(node?.decrease_start_population)
  && (action.decreaseStartPopulation = node.decrease_start_population);

  validateDecreaseHalfingPopulation(node?.decrease_halfing_population)
  && (action.decreaseHalfingPopulation = node.decrease_halfing_population);

  return action;
};

/** Convert a `SetMigrationParameters` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  return normalizeValues(node, {
    type: ACTION_NAME,
  });
};
