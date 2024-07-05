/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

// types
import {DepositType, DetailType, PropType, TreeType} from '~/utils/objects';

export namespace environment {
  export interface Environment {
    noiseAmplitudes?: NoiseAmplitudes;
    resourceFactor?: number;
    fordDistanceFactor?: number;
    sunAngleFactor?: number;
    backdropScale?: [number, number, number];
    deposits?: DepositType[];
    depositOverridePrototypes?: OverridePrototypes<DepositType>;
    detailOverridePrototypes?: OverridePrototypes<DetailType>;
    propOverridePrototypes?: OverridePrototypes<PropType>;
    globalTreeDensity?: number;
    treesEverywhere?: boolean;
    trees?: TreeType[];
    treeOverridePrototypes?: OverridePrototypes<TreeType>;
    seasons?: Seasons;
  }

  export type NoiseAmplitudes = [number, number?, number?, number?, number?, number?, number?, number?];

  export interface Seasons {
    Spring: SpringSeason;
    Fall: FallSeason;
    Summer: SummerSeason;
    Winter: WinterSeason;
  }

  export interface SpringSeason {
    duration: number;
    precipitationChance: number;
    windyChance: number;
    veryWindyChance: number;
    fishBoost: number;
    temperature: [number, number];
  }

  export interface FallSeason {
    duration: number;
    precipitationChance: number;
    windyChance: number;
    veryWindyChance: number;
    temperature: [number, number];
  }

  export interface SummerSeason {
    duration: number;
    precipitationChance: number;
    windyChance: number;
    wind: [number, number];
    temperature: [number, number];
  }

  export interface WinterSeason {
    duration: number;
    precipitationChance: number;
    windyChance: number;
    veryWindyChance: number;
    reducedFauna: boolean;
    temperature: [number, number];
  }

  export type OverridePrototypes<T extends string> = {
    [key in T]?: {
      density: number;
      altitude?: [number, number];
      humidity?: [number, number];
      angle?: [number, number];
    };
  }
}

