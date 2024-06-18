/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';
import {GAME_MODES} from '~/utils/condition';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'ScenarioCompleted';

/** Convert a `ScenarioCompleted` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if (!isString(node?.id) || !node?.id.trim()) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
    id: node?.id.trim(),
  };

  if (isString(node?.game_mode) && GAME_MODES.includes(node?.game_mode)) {
    condition.game_mode = node?.game_mode;
  }

  return condition;
};
