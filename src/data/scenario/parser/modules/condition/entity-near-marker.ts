/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isInt} from '~/helpers/number';
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';
import {ENTITIES} from '~/utils/entities';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'EntityNearMarker';

/** Convert a `EntityNearMarker` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if (!isString(node?.entity_type) || !ENTITIES.includes(node?.entity_type)) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
    entityType: node?.entity_type,
  };

  if (isInt(node?.value) && node?.value >= 0) {
    condition.value = node?.value;
  }

  return condition;
};
