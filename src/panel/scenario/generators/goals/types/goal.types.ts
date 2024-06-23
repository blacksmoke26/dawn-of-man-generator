/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

// types
import type {KVDocument} from '~/types/json.types';
import type {GeneralCondition, LogicalCondition} from '~/types/condition.types';

export interface GoalGeneralCondition {
  [key: string]: any;

  type: GeneralCondition;
}

export interface GoalLogicalCondition {
  [key: string]: any;

  type: LogicalCondition;
  conditions: GoalGeneralCondition;
}

export type GoalCondition = | GoalGeneralCondition | GoalLogicalCondition;
export type GoalPropConditions = GoalCondition[];
export type GoalConditionsAttributes = KVDocument<GoalCondition>;
export type GoalChangedConditions = GoalCondition[];

export interface GoalChangedValues {
  id?: string;
  description?: string;
}
