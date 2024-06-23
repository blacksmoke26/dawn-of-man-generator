/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

// types
import type {KVDocument} from '~/types/json.types';
import type {GeneralCondition, LogicalCondition} from '~/types/condition.types';

export interface MilestoneGeneralCondition {
  [key: string]: any;

  type: GeneralCondition;
}

export interface MilestoneLogicalCondition {
  [key: string]: any;

  type: LogicalCondition;
  conditions: MilestoneGeneralCondition;
}

export type MilestoneCondition = | MilestoneGeneralCondition | MilestoneLogicalCondition;
export type MilestonePropConditions = MilestoneCondition[];
export type MilestoneConditionsAttributes = KVDocument<MilestoneCondition>;
export type MilestoneChangedConditions = MilestoneCondition[];

export interface MilestoneChangedValues {
  id?: string;
  description?: string;
}
