/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isString} from '~/helpers/string';
import {ENTITIES} from '~/utils/entities';
import {isObject} from '~/helpers/object';
import {LOCATION_TYPE} from '~/utils/action';
import {isNumeric, toFloat} from '~/helpers/number';

// validators
import {validateDistance, validateRotation} from '~/utils/scenario/validator';

// types
import type {Json} from '~/types/json.types';
import type {ActionFocusCamera, ActionName, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'FocusCamera';
type ActionParams = ActionWithType<'FocusCamera', ActionFocusCamera>;

/** Convert a `FocusCamera` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const hasLocation = isString(node?.location, true)
    && LOCATION_TYPE.includes(node?.location);

  const hasEntityName = isString(node?.entity_name, true)
    && ENTITIES.includes(node?.entity_name);

  if (!hasLocation || !hasEntityName) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
    entityName: node.entity_name,
    location: node.location,
  } as ActionParams;

  isNumeric(node?.distance) && validateDistance(node.distance)
  && (action.distance = toFloat(node.distance, 2));

  isNumeric(node?.rotation) && validateRotation(node.rotation)
  && (action.rotation = toFloat(node.rotation, 2));

  return action;
};
