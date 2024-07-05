/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isBool} from '~/helpers/bool';
import {toString} from '~/helpers/string';
import {isObject} from '~/helpers/object';
import {FEATURE_TYPE} from '~/utils/action';

// validators
// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetFeatureEnabled, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetFeatureEnabled';
type ActionParams = ActionWithType<'SetFeatureEnabled', ActionSetFeatureEnabled>;

/** Convert a `SetFeatureEnabled` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  if (!FEATURE_TYPE.includes(toString(node?.feature))) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
    feature: node.feature,
  } as ActionParams;

  isBool(node?.value) && (action.value = node.value);

  return action;
};
