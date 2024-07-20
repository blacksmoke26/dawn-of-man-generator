/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import {snakeCase} from 'change-case';

// utils
import {isString} from '~/helpers/string';
import {isObject} from '~/helpers/object';

// normalizers
import {normalizeLocationIndex, normalizeVectorPosition} from '~/utils/scenario/normalizer-action';

// types
import type {Json} from '~/types/json.types';
import type {ActionModifyLocation, ActionName, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'ModifyLocation';
type ActionParams = ActionWithType<'ModifyLocation', ActionModifyLocation>;

/** Convert a `ModifyLocation` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  if (!isString(node?.modification, true)) return null;

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  normalizeLocationIndex(node?.location_index, value => action.locationIndex = value);
  normalizeVectorPosition(node?.position, value => action.position = value);

  action.modification = snakeCase(node.modification);

  return action;
};
