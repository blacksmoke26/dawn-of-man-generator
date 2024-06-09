/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import randomInt from 'random-int';
import randomFloatMod from 'random-float';
import uniqueRandomArray from 'unique-random-array';

// utils
import {
  SEASON_TEMPERATURE_MAX, SEASON_TEMPERATURE_MIN,
  RESOURCE_FACTOR_MIN, RESOURCE_FACTOR_MAX,
  DENSITY_MIN, DENSITY_MAX,
  ANGLE_MIN, ANGLE_MAX,
  ALTITUDE_MIN, ALTITUDE_MAX,
  HUMIDITY_MIN, HUMIDITY_MAX, SEASON_WIND_MIN, SEASON_WIND_MAX, PERIOD_MAX, PERIOD_MIN, DEFAULT_DISASTER,
} from './defaults';
import {
  DISTANCE_MAX,
  DISTANCE_MIN,
  ENTITY_COUNT_MAX,
  ENTITY_COUNT_MIN,
  PERFORMERS_MAX,
  PERFORMERS_MIN,
  WORKERS_MAX,
  WORKERS_MIN
} from '~/utils/condition';

// types
import {DisasterType} from '~/types/scenario.types';

/** Deposits types */
export const deposits: string[] = [
  'Flint', 'Tin', 'Copper', 'Iron',
];

/** Props types */
export const props: string[] = [
  'BigRocks', 'MediumRocks', 'Megalith',
  'Flint', 'SmallRocks', 'RiverRocks',
];

/** Details types */
export const details: string[] = [
  'DetailGrass', 'DetailReeds', 'DetailFlowers',
  'GroundPlant', 'DetailStick',
];

/** Disaster types */
export const disasters: string[] = [
  'Storm', 'Blizzard',
];

/** Trees types */
export const trees: string[] = [
  'Pear', 'Cherry', 'Service', 'Chestnut', 'Oak',
  'Fir', 'Pine', 'Spruce', 'Beech', 'Birch',
  'Barley', 'Rye', 'Einkorn', 'Emmer', 'Flax',
  'BitterVetch', 'Chickpeas', 'Lentils', 'Peas', 'Blackberry',
  'Blueberry', 'Raspberry', 'Strawberry',
];

/** Random float number  */
export const randomFloat = (fraction: number = 2): number => Number(randomFloatMod(0, 1).toFixed(fraction));

type RandomArrayFunc<T> = () => T;

/** Random array */
export const randomArray = <T = string>(list: T[], counts: number): T[] => {
  const rand = uniqueRandomArray(list) as RandomArrayFunc<T>;

  const collection: T[] = [];

  for (let i = 1; i <= counts; i++) {
    collection.push(rand());
  }

  return collection;
};

/** Random Frequency */
export const randomFrequency = (): number => Number(randomFloatMod(0, 1).toFixed(3));

/** Random Resource */
export const randomResource = (): number => randomInt(RESOURCE_FACTOR_MIN, RESOURCE_FACTOR_MAX);

/** Random Density */
export const randomDensity = (fraction: number = 2): number => +Number(randomFloatMod(DENSITY_MIN, DENSITY_MAX)).toFixed(fraction) as number;

/** Random Angle */
export const randomAngle = (): [number, number] => [
  randomInt(ANGLE_MIN, 40),
  randomInt(41, ANGLE_MAX)
];

/** Random season temperature */
export const randomSeasonTemperature = (): [number, number] => [
  randomInt(SEASON_TEMPERATURE_MIN, -1),
  randomInt(0, SEASON_TEMPERATURE_MAX)
];

/** Random season temperature */
export const randomSeasonWind = (): [number, number] => [
  randomInt(SEASON_WIND_MIN, 25),
  randomInt(26, SEASON_WIND_MAX)
];

/** Random Humidity */
export const randomHumidity = (): [number, number] => [
  Number(randomFloatMod(HUMIDITY_MIN, 0.50)).toFixed(2) as unknown as number,
  Number(randomFloatMod(0.51, HUMIDITY_MAX)).toFixed(2) as unknown as number
];

/** Random backdrop Scale */
export const randomBackdropScale = (): [string, string, string] => [
  Number(randomFloatMod(0, 1)).toFixed(2),
  Number(randomFloatMod(0, 1)).toFixed(2),
  Number(randomFloatMod(0, 1)).toFixed(2),
];

/** Random Altitude */
export const randomAltitude = (): [number, number] => [
  randomInt(ALTITUDE_MIN, 10),
  randomInt(11, ALTITUDE_MAX)
];

/** Random River */
export const randomRiver = (): boolean => (uniqueRandomArray([true, false])() as boolean);

/** Random Trees Everywhere */
export const randomTreesEverywhere = (): boolean => (uniqueRandomArray([true, false])() as boolean);

/** Random Frequencies */
export const randomFrequencies = (value: number | null | undefined = undefined): Record<string, number> => {
  const frequencies: string[] = [
    'freq1', 'freq2', 'freq3', 'freq4',
    'freq5', 'freq6', 'freq7', 'freq8',
  ];

  const collection: Record<string, number> = {};

  for (let f of frequencies) {
    collection[f] = value ?? randomFrequency();
  }

  return collection;
};

/** Random Deposits */
export const randomDeposits = (counts: number = 2): string[] => {
  const rand: Function = uniqueRandomArray(deposits);
  const list: string[] = [];

  for (let i = 1; i <= counts; i++) {
    list.push(rand());
  }

  return list;
};

/** Random Trees */
export const randomTrees = <T = string>(counts: number = 5): T[] => {
  const rand: Function = uniqueRandomArray(trees) as RandomArrayFunc<T>;
  const list: T[] = [];

  for (let i = 1; i <= counts; i++) {
    list.push(rand());
  }

  return list;
};

/** Random period */
export const randomPeriod = (): string => {
  return Number(randomFloatMod(PERIOD_MIN, PERIOD_MAX)).toFixed(1);
};

/** Random disaster */
export const randomDisaster = (): DisasterType => {
  return uniqueRandomArray(DEFAULT_DISASTER)() as DisasterType;
};

/** Random performers (condition) */
export const randomPerformers = (): number => {
  return randomInt(PERFORMERS_MIN, PERFORMERS_MAX);
};

/** Random workers (condition) */
export const randomWorkers = (): number => {
  return randomInt(WORKERS_MIN, WORKERS_MAX);
};

/** Random entity count (condition) */
export const randomEntityCount = (): number => {
  return randomInt(ENTITY_COUNT_MIN, ENTITY_COUNT_MAX);
};

/** Random distance (condition) */
export const randomDistance = (): number => {
  return randomInt(DISTANCE_MIN, DISTANCE_MAX);
};
