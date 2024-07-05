/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isString} from '~/helpers/string';
import {isObject} from '~/helpers/object';
import {WEATHER_TYPES} from '~/utils/action';

// validators
// types
import type {Json} from '~/types/json.types';
import type {ActionName, ActionSetWeather, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'SetWeather';
type ActionParams = ActionWithType<'SetWeather', ActionSetWeather>;

/** Convert a `SetWeather` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  const action = {
    type: ACTION_NAME,
  } as ActionParams;

  if (isString(node?.value, true) && WEATHER_TYPES.includes(node.value)) {
    action.value = node.value;
  }

  return action;
};
