/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isInt} from '~/helpers/number';
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';
import {filterUnique} from '~/helpers/array';
import {animalEntities} from '~/utils/entities';
import {ENTITY_COUNT_MAX, ENTITY_COUNT_MIN} from '~/utils/condition';

// validators
import {validateEraFactors} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetAnimalPopulation, ActionWithType, EraFactor} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetAnimalPopulation';
type ActionParams = ActionWithType<'SetAnimalPopulation', ActionSetAnimalPopulation>;

const normalizeEraFactors = (nums: number[]): EraFactor => {
  return [...new Array(6)].fill(0).map((num, index) => {
    return nums?.[index] ?? num;
  }) as EraFactor;
};

const normalizeValues = (node: Json, action: ActionParams): void => {
  (isInt(node?.min) && node.min >= ENTITY_COUNT_MIN) && (action.min = node.min);
  (isInt(node?.max) && node.max <= ENTITY_COUNT_MAX) && (action.max = node.max);

  if (action?.min !== undefined && action?.max !== undefined) {
    action?.min > action.max && (action.min = action.max);
    action?.max < action.min && (action.max = action.min);
  }

  if (validateEraFactors(node?.era_factors)) {
    const nums = String(node.era_factors).split(' ').map(Number);
    action.eraFactors = normalizeEraFactors(nums) as EraFactor;
  }
};

const normalizeAnimalTypes = (node: Json, action: ActionParams): void => {
  if (isString(node?.animal_type, true) && animalEntities.includes(node?.animal_type)) {
    action.animalType = node?.animal_type?.trim();
  }

  if (isString(node?.animal_types, true)) {
    delete action?.animalType;
    const animals = filterUnique(node
      .animal_types.trim().split(' ')
      .map((name: string) => name.trim()))
      .filter((name: string) => animalEntities.includes(name));

    animals.length && (action.animalTypes = animals);
  }
};

/** Convert a `SetAnimalPopulation` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  if (!('animal_type' in node) && !('animal_types' in node)) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  normalizeAnimalTypes(node, action);

  if (!('animalType' in action) && !('animalTypes' in action)) {
    return null;
  }

  normalizeValues(node, action);

  return action;
};
