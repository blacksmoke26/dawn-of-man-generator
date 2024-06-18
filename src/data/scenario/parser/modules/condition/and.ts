/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// utils
import {parseSubConditions} from './utils/condition';

// types
import type {Json} from '~/types/json.types';
import {isObject} from '~/helpers/object';

/** Convert an `And` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  return node === null || !isObject(node) || node?.type !== 'And'
    ?
    null : parseSubConditions('And', node);
};
