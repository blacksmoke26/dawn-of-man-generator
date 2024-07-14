/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isObject} from '~/helpers/object';
import {RADIUS_MIN} from '~/utils/defaults';

// normalizers
import {normalizePosition} from '~/utils/scenario/normalizer-location';
import {normalizeRadius} from '~/utils/scenario/normalizer-action';

// types
import type {Json} from '~/types/json.types';
import type {ActionClearTrees, ActionName, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'ClearTrees';
type ActionParams = ActionWithType<'ClearTrees', ActionClearTrees>;

/** Convert a `ClearTrees` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
    radius: normalizeRadius(node?.radius) || RADIUS_MIN,
  } as ActionParams;

  normalizePosition(node?.position, position => action.position = position);

  return action;
};
