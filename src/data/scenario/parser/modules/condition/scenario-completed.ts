/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import {snakeCase} from 'change-case';

// helpers
import {isInList} from '~/helpers/array';
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

  if (!isString(node?.id, true)) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
    id: snakeCase(node.id),
  };

  isInList(node?.game_mode, GAME_MODES, value => condition.gameMode = value);

  return condition;
};
