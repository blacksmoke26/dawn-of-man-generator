/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import randomInt from 'random-int';
import randomFloatMod from 'random-float';
import uniqueRandomArray from 'unique-random-array';

// utils
import * as Defaults from './defaults';

import {
  WORKERS_MIN,
  WORKERS_MAX,
  DISTANCE_MIN,
  DISTANCE_MAX,
  PERFORMERS_MIN,
  PERFORMERS_MAX,
  ENTITY_COUNT_MIN,
  ENTITY_COUNT_MAX,
} from '~/utils/condition';

// types
import {DisasterType} from '~/types/scenario.types';
import {EraFactor} from '~/types/action.types';
import {environment} from '~/data/environments/parser/types';
import {scenario} from '~/data/scenario/parser/types';

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
export const randomFloat = (fraction: number = 2, min: number = 0, max: number = 1): number => {
  return Number(randomFloatMod(min, max).toFixed(fraction));
};

type RandomArrayFunc<T> = () => T;

/** Random array */
export const randomArray = <T = string>(list: T[], counts: number, filterUnique: boolean = false): T[] => {
  const rand = uniqueRandomArray(list) as RandomArrayFunc<T>;

  const collection: T[] = [];

  for (let i = 1; i <= counts; i++) {
    collection.push(rand());
  }

  return !filterUnique
    ? collection
    : [...(new Set<string>(collection as string[]) as unknown as string[])] as T[];
};

/** Random Angle */
export const randomMinMaxTuple = (min: number, max: number): [number, number] => {
  const maxHalf = Math.floor(max / 2);
  return [randomInt(min, maxHalf - 1), randomInt(maxHalf, max)];
};

/** Return a random integer based on min and max limit */
export const randomIntMinMax = (min: number, max: number): number => {
  return randomInt(min, max);
};

/** Random Frequency */
export const randomFrequency = (): number => Number(randomFloatMod(0, 1).toFixed(3));

/** Random Resource */
export const randomResource = (float: boolean = false): number => {
  return float
    ? randomFloat(2, Defaults.RESOURCE_FACTOR_MIN, Defaults.RESOURCE_FACTOR_MAX)
    : randomInt(Defaults.RESOURCE_FACTOR_MIN, Defaults.RESOURCE_FACTOR_MAX);
};
export const randomDistanceHeightOffset = (float: boolean = false): number => {
  return float
    ? randomFloat(2, Defaults.DISTANCE_HEIGHT_OFFSET_MIN, Defaults.DISTANCE_HEIGHT_OFFSET_MAX)
    : randomInt(Defaults.DISTANCE_HEIGHT_OFFSET_MIN, Defaults.DISTANCE_HEIGHT_OFFSET_MAX);
};
export const randomSunAngleFactor = (float: boolean = false): number => {
  return float
    ? randomFloat(2, Defaults.SUN_ANGLE_FACTOR_MIN, Defaults.SUN_ANGLE_FACTOR_MAX)
    : randomInt(Defaults.SUN_ANGLE_FACTOR_MIN, Defaults.SUN_ANGLE_FACTOR_MAX);
};
export const randomFordDistanceFactor = (float: boolean = false): number => {
  return float
    ? randomFloat(2, Defaults.FORD_DISTANCE_FACTOR_MIN, Defaults.FORD_DISTANCE_FACTOR_MAX)
    : randomInt(Defaults.FORD_DISTANCE_FACTOR_MIN, Defaults.FORD_DISTANCE_FACTOR_MAX);
};

/** Random Density */
export const randomDensity = (float: boolean = false): number => {
  return float
    ? randomFloat(2, Defaults.DENSITY_MIN, Defaults.DENSITY_MAX)
    : randomInt(Defaults.DENSITY_MIN, Defaults.DENSITY_MAX);
};

/** Random Angle */
export const randomAngle = (): [number, number] => {
  return randomMinMaxTuple(Defaults.ANGLE_MIN, Defaults.ANGLE_MAX);
};

/** Random Angle */
export const randomAngleSingle = (): number => {
  return randomIntMinMax(Defaults.ANGLE_MIN, Defaults.ANGLE_MAX);
};

/** Random season temperature */
export const randomSeasonTemperature = (): [number, number] => [
  randomIntMinMax(Defaults.SEASON_TEMPERATURE_MIN, -1),
  randomIntMinMax(0, Defaults.SEASON_TEMPERATURE_MAX),
];

/** Random season temperature */
export const randomSeasonWind = (): [number, number] => {
  return randomMinMaxTuple(Defaults.SEASON_WIND_MIN, Defaults.SEASON_WIND_MAX);
};

export const randomSeasonDuration = (): number => {
  return randomFloat(2, Defaults.SEASON_DURATION_MIN, Defaults.SEASON_DURATION_MAX);
};

export const randomSeasonPrecipitationChance = (): number => {
  return randomFloat(2, Defaults.SEASON_PRECIPITATION_CHANCE_MIN, Defaults.SEASON_PRECIPITATION_CHANCE_MAX);
};

export const randomSeasonWindyChance = (): number => {
  return randomFloat(2, Defaults.SEASON_WINDY_CHANCE_MIN, Defaults.SEASON_WINDY_CHANCE_MAX);
};

export const randomSeasonVeryWindyChance = (): number => {
  return randomFloat(2, Defaults.SEASON_VERY_WINDY_CHANCE_MIN, Defaults.SEASON_VERY_WINDY_CHANCE_MAX);
};

export const randomSeasonFishBoost = (): number => {
  return randomFloat(2, Defaults.SEASON_FISH_BOOST_MIN, Defaults.SEASON_FISH_BOOST_MAX);
};

export const randomSeasonSpring = (): environment.SpringSeason => {
  return {
    duration: randomSeasonDuration(),
    precipitationChance: randomSeasonPrecipitationChance(),
    windyChance: randomSeasonWindyChance(),
    veryWindyChance: randomSeasonVeryWindyChance(),
    fishBoost: randomSeasonFishBoost(),
    temperature: randomSeasonTemperature(),
  };
};

export const randomSeasonSummer = (): environment.SummerSeason => {
  return {
    duration: randomSeasonDuration(),
    precipitationChance: randomSeasonPrecipitationChance(),
    windyChance: randomSeasonWindyChance(),
    wind: randomSeasonWind(),
    temperature: randomSeasonTemperature(),
  };
};

export const randomSeasonFall = (): environment.FallSeason => {
  return {
    duration: randomSeasonDuration(),
    precipitationChance: randomSeasonPrecipitationChance(),
    windyChance: randomSeasonWindyChance(),
    veryWindyChance: randomSeasonVeryWindyChance(),
    temperature: randomSeasonTemperature(),
  };
};

export const randomSeasonWinter = (): environment.WinterSeason => {
  return {
    duration: randomSeasonDuration(),
    precipitationChance: randomSeasonPrecipitationChance(),
    windyChance: randomSeasonWindyChance(),
    veryWindyChance: randomSeasonVeryWindyChance(),
    reducedFauna: randomArray<boolean>([true, false], 1)[0],
    temperature: randomSeasonTemperature(),
  };
};

export const randomSeasons = (): environment.Seasons => {
  return {
    Spring: randomSeasonSpring(),
    Summer: randomSeasonSummer(),
    Fall: randomSeasonFall(),
    Winter: randomSeasonWinter(),
  };
}

/** Random Humidity */
export const randomHumidity = (): [number, number] => [
  Number(randomFloatMod(Defaults.HUMIDITY_MIN, 0.50)).toFixed(2) as unknown as number,
  Number(randomFloatMod(0.51, Defaults.HUMIDITY_MAX)).toFixed(2) as unknown as number,
];

/** Random backdrop Scale */
export const randomBackdropScale = (): [number, number, number] => [
  +Number(randomFloatMod(0, 1)).toFixed(2),
  +Number(randomFloatMod(0, 1)).toFixed(2),
  +Number(randomFloatMod(0, 1)).toFixed(2),
];

/** Random Altitude */
export const randomAltitude = (): [number, number] => {
  return randomMinMaxTuple(Defaults.ALTITUDE_MIN, Defaults.ALTITUDE_MAX);
};

/** Random River */
export const randomRiver = (): boolean => {
  return uniqueRandomArray([true, false])() as boolean;
};

/** Random Trees Everywhere */
export const randomTreesEverywhere = (): boolean => {
  return uniqueRandomArray([true, false])() as boolean;
};

/** Random Frequencies */
export const randomFrequencies = <T extends string = string>(value: number | null | undefined = undefined): Record<T, number> => {
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
export const randomDeposits = <T = string>(counts: number = 4): T[] => {
  return randomArray(deposits, counts, true) as T[];
};

/** Random Trees */
export const randomTrees = <T = string>(counts: number = 0): T[] => {
  return randomArray(trees, counts || trees.length, true) as T[];
};

/** Random period */
export const randomPeriod = (): string => {
  return Number(randomFloatMod(Defaults.PERIOD_MIN, Defaults.PERIOD_MAX)).toFixed(1);
};

/** Random disaster */
export const randomDisaster = (disasterType: scenario.DisasterName): scenario.Disaster => {
  return {
    disasterType,
    period: +randomPeriod(),
    variance: +randomPeriod(),
  }
};

/** Random performers (condition) */
export const randomPerformers = (): number => {
  return randomIntMinMax(PERFORMERS_MIN, PERFORMERS_MAX);
};

/** Random workers (condition) */
export const randomWorkers = (): number => {
  return randomIntMinMax(WORKERS_MIN, WORKERS_MAX);
};

/** Random entity count (condition) */
export const randomEntityCount = (): number => {
  return randomIntMinMax(ENTITY_COUNT_MIN, ENTITY_COUNT_MAX);
};

/** Random entity min/max values (condition) */
export const randomEntityMinMax = (): [number, number] => {
  return randomMinMaxTuple(ENTITY_COUNT_MIN, ENTITY_COUNT_MAX);
};

/** Random distance (condition) */
export const randomDistance = (decimal: number = 0): number => {
  return !decimal
    ? randomIntMinMax(DISTANCE_MIN, DISTANCE_MAX)
    : randomFloat(decimal, DISTANCE_MIN, DISTANCE_MAX);
};

/** Random radius (action) */
export const randomRadius = (decimal: number = 0): number => {
  return !decimal
    ? randomIntMinMax(Defaults.RADIUS_MIN, Defaults.RADIUS_MAX)
    : randomFloat(decimal, Defaults.RADIUS_MIN, Defaults.RADIUS_MAX);
};

/** Random rotation (action) */
export const randomRotation = (decimal: number = 0): number => {
  return !decimal
    ? randomIntMinMax(Defaults.ROTATION_MIN, Defaults.ROTATION_MAX)
    : randomFloat(decimal, Defaults.ROTATION_MIN, Defaults.ROTATION_MAX);
};

export const randomAnimalMinMax = (): [number, number] => {
  const half = Math.floor(Defaults.ANIMAL_POPULATION_MAX / 2);
  return [
    randomIntMinMax(Defaults.ANIMAL_POPULATION_MIN, half),
    randomIntMinMax(half, Defaults.ANIMAL_POPULATION_MAX),
  ];
};

/** Random location index (action) */
export const randomLocationIndex = (): number => {
  return randomIntMinMax(Defaults.LOCATION_INDEX_MIN, Defaults.LOCATION_INDEX_MAX);
};

/** Random location index (action) */
export const randomEraFactors = (): EraFactor => [
  randomFloat(1, Defaults.ERA_FACTORS_MIN, Defaults.ERA_FACTORS_MAX),
  randomFloat(1, Defaults.ERA_FACTORS_MIN, Defaults.ERA_FACTORS_MAX),
  randomFloat(1, Defaults.ERA_FACTORS_MIN, Defaults.ERA_FACTORS_MAX),
  randomFloat(1, Defaults.ERA_FACTORS_MIN, Defaults.ERA_FACTORS_MAX),
  randomFloat(1, Defaults.ERA_FACTORS_MIN, Defaults.ERA_FACTORS_MAX),
  randomFloat(1, Defaults.ERA_FACTORS_MIN, Defaults.ERA_FACTORS_MAX),
];

/** Random 3D vector position (action) */
export const randomVectorPosition = (): [number, number, number] => {
  return [
    randomFloat(1, Defaults.POSITION_VECTOR_MIN, Defaults.POSITION_VECTOR_MAX),
    randomFloat(1, Defaults.POSITION_VECTOR_MIN, Defaults.POSITION_VECTOR_MAX),
    randomFloat(1, Defaults.POSITION_VECTOR_MIN, Defaults.POSITION_VECTOR_MAX),
  ];
};

/** Random decrease start population (action) */
export const randomDecreaseStartPopulation = (): number => {
  return randomIntMinMax(Defaults.DECREASE_START_POPULATION_MIN, Defaults.DECREASE_START_POPULATION_MAX);
};

/** Random decrease halfing population (action) */
export const randomDecreaseHalfingPopulation = (): number => {
  return randomIntMinMax(Defaults.DECREASE_HALFING_POPULATION_MIN, Defaults.DECREASE_HALFING_POPULATION_MAX);
};

/** Random individual disease chance (action) */
export const randomIndividualDiseaseChance = (): number => {
  return randomFloat(1, Defaults.INDIVIDUAL_DISEASE_CHANCE_MIN, Defaults.INDIVIDUAL_DISEASE_CHANCE_MAX);
};

/** Random scale (action) */
export const randomScale = (): number => {
  return randomFloat(1, Defaults.SCALE_MIN, Defaults.SCALE_MAX);
};

/** Random migration min/max (action) */
export const randomMigrationMinMax = (): [number, number] => {
  return randomMinMaxTuple(Defaults.MIGRATION_MIN, Defaults.MIGRATION_MAX);
};

/** Random time of year (action) */
export const randomTimeOfYear = (): number => {
  return randomFloat(1, Defaults.TIME_OF_YEAR_MIN, Defaults.TIME_OF_YEAR_MAX);
};

/** Random timescale index (action) */
export const randomTimeScaleIndex = (): number => {
  return randomFloat(1, Defaults.TIME_SCALE_INDEX_MIN, Defaults.TIME_SCALE_INDEX_MAX);
};

/** Random raider attack amount (action) */
export const randomRaiderAttackAmount = (): number => {
  return randomIntMinMax(Defaults.RAIDER_ATTACK_AMOUNT_MIN, Defaults.RAIDER_ATTACK_AMOUNT_MAX);
};

/** Random years old (action) */
export const randomYearsOld = (): number => {
  return randomIntMinMax(Defaults.YEARS_OLD_MIN, Defaults.YEARS_OLD_MAX);
};

/** Random period */
export const randomShieldRatio = (): number => {
  return +randomFloatMod(Defaults.SHIELD_RATIO_MIN, Defaults.SHIELD_RATIO_MAX).toFixed(2);
};

/** Random period */
export const randomArmorRatio = (): number => {
  return +randomFloatMod(Defaults.ARMOR_RATIO_MIN, Defaults.ARMOR_RATIO_MAX).toFixed(2);
};
