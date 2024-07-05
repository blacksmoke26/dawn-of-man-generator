/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import {pascalCase, snakeCase} from 'change-case';

// utils
import {toFloat} from '~/helpers/number';
import {isObject} from '~/helpers/object';
import {isString, toString} from '~/helpers/string';
import {ENTITIES} from '~/utils/entities';
import {AGE_TYPES, BEHAVIOUR_TYPES, GENDER_TYPES, SPAWN_TYPES} from '~/utils/action';
import {
  validateAge,
  validateAngle,
  validateRadius,
  validateEntityCount,
  validateLocationPosition,
} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSpawn, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'Spawn';
type ActionParams = ActionWithType<'Spawn', ActionSpawn>;

const normalizeValues = (node: Json, action: ActionParams) => {
  (isString(node?.age, true)
    && AGE_TYPES.includes(node?.age))
  && (action.age = node.age);

  validateAge(node?.years_old) && (action.yearsOld = node.years_old);

  (isString(node?.gender, true)
    && GENDER_TYPES.includes(node?.gender))
  && (action.gender = node.gender);

  isString(node?.name) && (action.name = snakeCase(node?.name));

  validateLocationPosition(action.position) && (
    action.position = node.position.split(',').map((val: string) => toFloat(val, 1))
  );

  (isString(node?.spawn_type, true)
    && SPAWN_TYPES.includes(node?.spawn_type))
  && (action.spawnType = node.spawn_type);

  (isString(node?.behaviour, true)
    && BEHAVIOUR_TYPES.includes(node?.behaviour))
  && (action.behaviour = node.behaviour);
};

/** Convert a `Spawn` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const hasEntityType = isString(node?.entity_type, true)
    && ENTITIES.includes(node?.entity_type);

  if (!hasEntityType
    || !validateEntityCount(node?.amount)
    || !toString(node?.placement).trim()) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
    entityType: node.entity_type,
    amount: node.amount,
    placement: pascalCase(node?.placement),
  } as ActionParams;

  validateAngle(node?.angle) && (action.angle = toFloat(node.angle, 3));
  validateRadius(node?.radius) && (action.radius = toFloat(node.radius, 3));

  normalizeValues(node, action);

  return action;
};
