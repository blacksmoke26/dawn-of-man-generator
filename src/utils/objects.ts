/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

import {DeepPartial} from 'utility-types';
import {DeepOmit} from '~/types/utility.types';

export interface DensityObject {
  disabled: boolean;
  value: number;
}

export interface AltitudeObject {
  disabled: boolean;
  min: number;
  max: number;
}

export interface AngleObject {
  disabled: boolean;
  min: number;
  max: number;
}

export interface HumidityObject {
  disabled: boolean;
  min: number;
  max: number;
}

export interface ObjectAttributes {
  density?: Partial<DensityObject>;
  altitude?: Partial<AltitudeObject>;
  angle?: Partial<AngleObject>;
  humidity?: Partial<HumidityObject>;
}

export type ObjectAttributesCasual = DeepPartial<DeepOmit<ObjectAttributes, 'disabled'>>;

export type ObjectType = typeof objects[number];

export type DetailType = typeof details[number];
export type DepositType = typeof deposits[number];
export type PropType = typeof props[number];
export type TreeType = typeof trees[number];

type KeysOfType<T extends ObjectType> = (
  T extends 'deposit'
    ? DepositType
    : T extends 'tree'
      ? TreeType
      : T extends 'prop'
        ? PropType
        : T extends 'detail'
          ? DetailType
          : never);

export type ObjectPrototype<T extends ObjectType> = DeepPartial<Record<KeysOfType<T>, ObjectAttributes>>;

export const objects = [
  'tree', 'detail', 'prop', 'deposit',
] as const;

export const deposits = [
  'Flint', 'Tin', 'Copper', 'Iron',
] as const;

/** Props types */
export const props = [
  'BigRocks', 'MediumRocks', 'Megalith',
  'Flint', 'SmallRocks', 'RiverRocks',
] as const;

/** Details types */
export const details = [
  'DetailGrass', 'DetailReeds', 'DetailFlowers',
  'GroundPlant', 'DetailStick',
] as const;

export const trees = [
  'Pear', 'Cherry', 'Service', 'Chestnut', 'Oak',
  'Fir', 'Pine', 'Spruce', 'Beech', 'Birch',
  'Barley', 'Rye', 'Einkorn', 'Emmer', 'Flax',
  'BitterVetch', 'Chickpeas', 'Lentils', 'Peas',
  'Blackberry', 'Blueberry', 'Raspberry', 'Strawberry',
] as const;
