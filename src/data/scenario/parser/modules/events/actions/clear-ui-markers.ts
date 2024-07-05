/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isObject} from '~/helpers/object';

// types
import type {Json} from '~/types/json.types';
import type {ActionClearUiMarkers, ActionName, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'ClearUiMarkers';
type ActionParams = ActionWithType<'ClearUiMarkers', ActionClearUiMarkers>;

/** Convert a `ClearUiMarkers` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  return {
    type: ACTION_NAME,
  } as ActionParams;
};
