/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

import {snakeCase} from 'change-case';

// utils
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';

// types
import type {Json} from '~/types/json.types';
import type {ActionShowMessage, ActionName, ActionWithType} from '~/types/action.types';

const ACTION_NAME: ActionName = 'ShowMessage';
type ActionParams = ActionWithType<'ShowMessage', ActionShowMessage>;

/** Convert a `ShowMessage` action into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== ACTION_NAME) {
    return null;
  }

  if ( !isString(node?.title, true) || !isString(node?.text, true) ) {
    return null;
  }

  return {
    type: ACTION_NAME,
    title: snakeCase(node.title),
    text: snakeCase(node.text),
  } as ActionParams;
};
