/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// helpers
import {isObject} from '~/helpers/object';
import {ENTITIES} from '~/utils/entities';
import {isInList} from '~/helpers/array';
import {COMPARISONS, COUNTERS} from '~/utils/condition';

// utils
import {normalizeEntityCount} from '~/utils/scenario/normalizer-condition';

// types
import type {Json} from '~/types/json.types';
import type {GeneralCondition} from '~/types/condition.types';

const CONDITION_TYPE: GeneralCondition = 'EntityCountComparison';

/** Convert a `EntityCountComparison` condition into redux data */
export const jsonToRedux = (node: Json | any): Json | null => {
  if (node === null || !isObject(node) || node?.type !== CONDITION_TYPE) {
    return null;
  }

  if (!isInList(node?.comparison, COMPARISONS)
    || !isInList(node?.entity_type, ENTITIES)) {
    return null;
  }

  const condition: Json = {
    type: CONDITION_TYPE,
  };

  isInList(node?.counter, COUNTERS, value => condition.counter = value)

  condition.entityType = node.entity_type;

  normalizeEntityCount(node?.value, num => condition.value = num);

  condition.comparison = node.comparison;

  return condition;
};
