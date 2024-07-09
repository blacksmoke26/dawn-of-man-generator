/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

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
