/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

export namespace environment {
  export type NoiseAmplitudes = [number, number?, number?, number?, number?, number?, number?, number?];

  export interface Environment {
    noiseAmplitudes?: null | NoiseAmplitudes;
    resourceFactor?: null | number;
    distanceHeightOffset?: null | number;
    fordDistanceFactor?: null | number;
    sunAngleFactor?: null | number;
    backdropScale?: null | [number, number, number];
    deposits?: null | prototypes.DepositType[];
    depositOverridePrototypes?: null | prototypes.OverridePrototypes<prototypes.DepositType>;
    detailOverridePrototypes?: null | prototypes.OverridePrototypes<prototypes.DetailType>;
    propOverridePrototypes?: null | prototypes.OverridePrototypes<prototypes.PropType>;
    globalTreeDensity?: null | number;
    treesEverywhere?: null | boolean;
    trees?: null | prototypes.TreeType[];
    treeOverridePrototypes?: null | prototypes.OverridePrototypes<prototypes.TreeType>;
    seasons?: null | season.Seasons;
  }

  export namespace season {
    export type Name = keyof Seasons;

    export interface Seasons {
      Spring: Spring;
      Fall: Fall;
      Summer: Summer;
      Winter: Winter;
    }

    export interface SpringConfig {
      id: 'Spring';
      setupId: 'Spring';
      duration: number;
      precipitationChance: number;
      windyChance: number;
      veryWindyChance: number;
      fishBoost: number;
      temperature: [number, number];
    }

    export interface SummerConfig {
      id: 'Summer';
      setupId: 'Summer';
      duration: number;
      precipitationChance: number;
      windyChance: number;
      wind?: [number, number];
      temperature: [number, number];
    }

    export interface FallConfig {
      id: 'Fall';
      setupId: 'Fall';
      duration: number;
      precipitationChance: number;
      windyChance: number;
      veryWindyChance: number;
      temperature: [number, number];
    }

    export interface WinterConfig {
      id: 'Winter';
      setupId: 'Winter';
      snowSetupId: 'WinterSnow';
      duration: number;
      precipitationChance: number;
      windyChance: number;
      veryWindyChance: number;
      reducedFauna: boolean;
      temperature: [number, number];
    }

    export type Spring = Omit<SpringConfig, 'id' | 'setupId'>;
    export type Summer = Omit<SummerConfig, 'id' | 'setupId'>;
    export type Fall = Omit<FallConfig, 'id' | 'setupId'>;
    export type Winter = Omit<WinterConfig, 'id' | 'setupId' | 'snowSetupId'>;
  }

  export namespace prototypes {
    export type ObjectType = 'tree' | 'detail' | 'prop' | 'deposit';

    export type DepositType =
      'Flint' | 'Tin' | 'Copper' | 'Iron';

    /** Props types */
    export type PropType =
      'BigRocks' | 'MediumRocks' | 'Megalith' |
      'Flint' | 'SmallRocks' | 'RiverRocks';

    /** Details types */
    export type DetailType =
      'DetailGrass' | 'DetailReeds' | 'DetailFlowers' |
      'GroundPlant' | 'DetailStick';

    export type TreeType =
      'Pear' | 'Cherry' | 'Service' | 'Chestnut' | 'Oak' |
      'Fir' | 'Pine' | 'Spruce' | 'Beech' | 'Birch' |
      'Barley' | 'Rye' | 'Einkorn' | 'Emmer' | 'Flax' |
      'BitterVetch' | 'Chickpeas' | 'Lentils' | 'Peas' |
      'Blackberry' | 'Blueberry' | 'Raspberry' | 'Strawberry';

    export interface OverridePrototype {
      density?: number;
      altitude?: [number, number];
      humidity?: [number, number];
      angle?: [number, number];
    }

    export type OverridePrototypes<Type extends string = string> = Record<Type, OverridePrototype>;
  }
}

