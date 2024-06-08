/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */
import {Json} from '~/types/json.types';
import {SeasonsProp} from '~/utils/seasons.types';
import {StartingCondition} from '~/types/scenario.types';

export interface Environment {
  noiseAmplitudes?: [number, number, number, number, number, number, number, number] | boolean;
  resourceFactor?: number | boolean;
  distanceHeightOffset?: number | boolean;
  fordDistanceFactor?: number | boolean;
  sunAngleFactor?: number | boolean;
  backdropScale?: [number, number, number] | boolean;
  deposits?: string[] | boolean;
  depositOverridePrototypes?: Json | boolean;
  detailOverridePrototypes?: Json | boolean;
  propOverridePrototypes?: Json | boolean,
  globalTreeDensity?: number | boolean;
  treesEverywhere?: boolean;
  trees?: string[] | boolean;
  treeOverridePrototypes?: Json | boolean;
  seasons?: SeasonsProp | boolean;
}

export interface Scenario {
  hardcoreModeAllowed?: boolean;
  category?: string;
  groupId?: string;
  visible?: string;
  nomadModeAllowed?: boolean;
  showCompletionIcon?: boolean;
  size?: number;
  requiredScenario?: string;
  startingCondition?: StartingCondition;
  loadingScreen?: string;
  locations?: Json[];
}

export interface AppState {
  environment?: Environment;
  scenario?: Scenario;
  initiated: boolean;
}
