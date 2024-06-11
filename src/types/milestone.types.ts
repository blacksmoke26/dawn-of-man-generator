/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {ConditionType, LogicalCondition} from '~/types/condition.types';

/**
 * @example
 * const example: Milestone = {
 *   id: 'survival5',
 *   conditions: {
 *     'test': {
 *       internalName: 'condition_And_548',
 *       type: 'And',
 *       subConditions: {
 *         internalName: 'condition_TimeElapsed_985',
 *         type: 'TimeElapsed',
 *       }
 *     }
 *   }
 * };
 */
export interface Milestone {
  id: string;
  conditions: Conditions;
}

export interface MilestoneConditionLogical {
  /** Unique name internally */
  internalName: string;
  /** Condition type */
  type: LogicalCondition;
  /** list of sub-conditions */
  subConditions: ConditionType;
}

export interface Conditions {
  [uniqueId: string]: | ConditionType | MilestoneConditionLogical;
}

