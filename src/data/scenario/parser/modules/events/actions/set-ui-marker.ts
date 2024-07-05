/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import {snakeCase} from 'change-case';

// utils
import {isObject} from '~/helpers/object';
import {ENTITIES} from '~/utils/entities';
import {isString} from '~/helpers/string';
import {DANGER_LEVEL_TYPES, MARKER_TYPES, UI_CONTEXT_ACTIONS} from '~/utils/action';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetUiMarker, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetUiMarker';
type ActionParams = ActionWithType<'SetUiMarker', ActionSetUiMarker>;

/** Convert a `SetUiMarker` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const hasEntityType = isString(node?.entity_type, true)
    && ENTITIES.includes(node?.entity_type);

  const hasContextAction = isString(node?.context_action, true)
    && UI_CONTEXT_ACTIONS.includes(node?.context_action);

  if (!isString(node?.work_area_id, true) || !hasEntityType || !hasContextAction) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  (isString(node?.marker_type, true)
    && MARKER_TYPES.includes(node?.marker_type))
  && (action.markerType = node?.marker_type);

  action.entityType = node?.entity_type;
  action.contextAction = node?.context_action;
  action.workAreaId = snakeCase(node.work_area_id);

  isString(node?.excluded_goal, true)
  && (action.excludedGoal = snakeCase(node.excluded_goal));

  isString(node?.required_goal, true)
  && (action.requiredGoal = snakeCase(node.required_goal));

  (isString(node?.max_danger_level, true)
    && DANGER_LEVEL_TYPES.includes(node?.max_danger_level))
  && (action.maxDangerLevel = node?.max_danger_level);

  return action;
};
