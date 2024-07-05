/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';
import {ERAS} from '~/utils/condition';
import {techEntities} from '~/utils/entities';

// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionUnlock, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'Unlock';
type ActionParams = ActionWithType<'Unlock', ActionUnlock>;

/** Convert a `Unlock` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  (isString(node?.tech_type, true) && ERAS.includes(node.tech_era))
  && (action.techEra = node.tech_era);

  (isString(node?.tech_type, true) && techEntities.includes(node.tech_type))
  && (action.techType = node.tech_type);

  return Object.keys(action).length < 2 ? null : action;
};
