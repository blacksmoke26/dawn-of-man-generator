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

// normalizers
import {normalizeDistance, normalizeRotation} from '~/utils/scenario/normalizer-action';

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

  const hasEntityName = isString(node?.entity_name, true)
    && ENTITIES.includes(node?.entity_name);

  const hasLocation = isString(node?.location, true)
    && LOCATION_TYPE.includes(node?.location);

  if (!hasEntityName || !hasLocation) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
    entityName: node.entity_name,
    location: node.location,
  } as ActionParams;

  normalizeDistance(node?.distance, distance => action.distance = distance);
  normalizeRotation(node?.rotation, rotation => action.rotation = rotation);

  return action;
};
