/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-24
 * @version 2.3.0
 */

// types
import {Json} from '~/types/json.types';
import {SeasonsProp} from '~/utils/seasons.types';

export type NoiseAmplitudes =
  [number, number?, number?, number?, number?, number?, number?, number?];

export interface Environment {
  noiseAmplitudes?: NoiseAmplitudes | boolean;
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
