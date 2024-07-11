/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

// types
import type {KVDocument, MapDocument} from '~/types/json.types';
import type {scenario} from '~/data/scenario/parser/types';

// public types
export type ActionsState = Record<string, scenario.action.Action>;
export const actionTypesCounter = (actions: ActionsState): MapDocument<scenario.action.Name> => {
  return Object.values(actions as KVDocument)
    .reduce((accum: KVDocument, current: scenario.action.Action) => {
      accum[current.type] = (accum?.[current.type] || 0) + 1;
      return accum;
    }, {});
};
