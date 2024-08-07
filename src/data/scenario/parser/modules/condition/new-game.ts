/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isInList} from '~/helpers/array';
import {isObject} from '~/helpers/object';
import {START_MODES} from '~/utils/condition';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'NewGame';

/** Convert a `NewGame` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
  };

  isInList(node?.start_mode, START_MODES, value => condition.startMode = value);

  return condition;
};
