/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {Omit} from 'utility-types';
import {Season} from '~/utils/seasons.types';

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
