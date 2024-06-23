/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {Omit} from 'utility-types';
import {Season} from '~/utils/seasons.types';
import type {Json} from '~/types/json.types';

export interface StartingCondition {
  seasonId: Season;
}

export type DisasterType = | 'Storm' | 'Blizzard';

export interface Disaster {
  disasterType: DisasterType;
  period: string;
  variance: string;
}

export type Disasters = Record<DisasterType, Omit<Disaster, 'disasterType'>>;

export interface Scenario {
  hardcoreModeAllowed?: boolean;
  category?: string;
  groupId?: string;
  visible?: boolean;
  nomadModeAllowed?: boolean;
  showCompletionIcon?: boolean;
  size?: number;
  requiredScenario?: string;
  disasters?: Disasters;
  requiredMilestones?: number;
  startingCondition?: StartingCondition;
  customSettlementNameAllowed?: boolean;
  loadingScreen?: string;
  locations?: Json[];
}
