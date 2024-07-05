/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import {snakeCase} from 'change-case';

// utils
import {toFloat} from '~/helpers/number';
import {isObject} from '~/helpers/object';
import {ENTITIES} from '~/utils/entities';
import {isString, toString} from '~/helpers/string';
import {MARKER_TYPES, REF_POSITIONS} from '~/utils/action';
import {validateLocationPosition, validateScale} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetLocationMarker, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetLocationMarker';
type ActionParams = ActionWithType<'SetLocationMarker', ActionSetLocationMarker>;

/** Convert a `SetLocationMarker` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  if (isString(node?.work_area_id, true)
    || !ENTITIES.includes(toString(node?.entity_type))) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  MARKER_TYPES.includes(toString(node?.marker_type))
  && (action.markerType = node?.marker_type);

  action.entityType = node.entity_type;

  isString(node?.required_goal, true)
  && (action.requiredGoal = snakeCase(node.required_goal));

  isString(node?.excluded_goal, true)
  && (action.excludedGoal = snakeCase(node.excluded_goal));

  action.workAreaId = snakeCase(node.work_area_id);

  validateLocationPosition(node?.position)
  && (action.position = node.position.split(',').map((n: string) => toFloat(n, 1)));

  validateScale(node?.scale)
  && (action.scale = toFloat(node?.scale, 2));

  REF_POSITIONS.includes(toString(node?.ref_position))
  && (action.refPosition = node?.ref_position);

  return action;
};
