/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isString} from '~/helpers/string';
import {isObject} from '~/helpers/object';
import {GAMEPLAY_FLAGS} from '~/utils/action';
import {animalEntities} from '~/utils/entities';

// validators
// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetGameplayFlags, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetGameplayFlags';
type ActionParams = ActionWithType<'SetGameplayFlags', ActionSetGameplayFlags>;

/** Convert a `SetGameplayFlags` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  if (!isString(node?.flags, true) || !GAMEPLAY_FLAGS.includes(node?.flags)) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
    flags: node.flags,
  } as ActionParams;

  (isString(node?.controllable_animal, true)
    && animalEntities.includes(node?.controllable_animal))
  && (action.controllableAnimal = node.controllable_animal);

  return action;
};
