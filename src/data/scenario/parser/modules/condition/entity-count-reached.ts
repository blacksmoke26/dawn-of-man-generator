/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isInList} from '~/helpers/array';
import {isObject} from '~/helpers/object';
import {ENTITIES} from '~/utils/entities';
import {COUNTERS} from '~/utils/condition';

// utils
import {normalizeEntityCount} from '~/utils/scenario/normalizer-condition';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'EntityCountReached';

/** Convert a `EntityCountReached` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if (!isInList(node?.entity_type, ENTITIES)) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
  };

  isInList(node?.counter, COUNTERS, value => condition.counter = value)

  condition.entityType = node?.entity_type;

  normalizeEntityCount(node?.value, value => condition.value = value);

  return condition;
};
