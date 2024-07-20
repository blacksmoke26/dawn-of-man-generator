/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import randomInt from 'random-int';
import {faker} from '@faker-js/faker';
import randomFloat from 'random-float';
import uniqueRandomArray from 'unique-random-array';

// utils
import {
  LOCATION_LAKES_MAX,
  LOCATION_LAKES_MIN,
  LOCATION_POSITION_MAX,
  LOCATION_POSITION_MIN,
} from '~/utils/scenario/defaults';
import {scenario} from '~/data/scenario/parser/types';
import {capitalCase, snakeCase} from 'change-case';
import {LangStrings} from '~/utils/strings';
import {onlyKeys} from '~/helpers/object';

/** Builtin environments */
export const environments: string[] = [
  'eurasia', 'eurasia_conflict', 'eurasia_flatlands',
  'eurasia_glacial', 'eurasia_north', 'eurasia_warm', 'flat',
];

/**
 * @public
 * @static
 * Random Coordinate */
export function randomCoordinate(): number {
  return +randomFloat(0, 1).toFixed(3);
}

/**
 * @public
 * @static
 * Random Coordinates */
export const randomCoordinates = (): [number, number] => [
  randomCoordinate(),
  randomCoordinate(),
];

/**
 * @public
 * @static
 * Random Name */
export const randomName = (): { name: string, slug: string } => {
  const name: string = faker.location.city();
  return {name, slug: snakeCase(name)};
};

/**
 * @public
 * @static
 * Random Seed */
export const randomSeed = (): number => randomInt(0, 99999999);

/**
 * @public
 * @static
 * @param [custom] - List of custom environments
 * Random Environment */
export const randomEnvironment = (custom: string[] = []): string => {
  return (uniqueRandomArray([...environments, ...custom])() as string);
};

/**
 * @public
 * @static
 * Random Lakes */
export const randomLakes = (): number => randomInt(LOCATION_LAKES_MIN, LOCATION_LAKES_MAX);

/**
 * @public
 * @static
 * Random River */
export const randomRiver = (): boolean => uniqueRandomArray([true, false])();

export const randomPosition = (): [number, number] => [
  randomInt(LOCATION_POSITION_MIN, LOCATION_POSITION_MAX),
  randomInt(LOCATION_POSITION_MIN, LOCATION_POSITION_MAX),
];

/**
 * @public
 * @static
 * @param [customEnvironments] - List of custom environments
 * @param [filterKeys] - List of keys to exclude
 * Randomize location values */
export const randomizeLocation = (customEnvironments: string[] = [], filterKeys: (keyof scenario.Location)[] = []): scenario.Location => {
  const data = {
    id: snakeCase(randomName().slug) as scenario.Location['id'],
    seed: randomSeed(),
    environment: randomEnvironment(customEnvironments).toLowerCase() as scenario.Location['environment'],
    mapLocation: randomCoordinates(),
    position: randomPosition(),
    river: randomRiver(),
    lakes: randomLakes(),
  };

  return !filterKeys.length
    ? data
    : onlyKeys(data, filterKeys, true);
};

/** Convert location nodes into language strings */
export const locationToStrings = (locations: scenario.Location[], disabled: boolean = false): LangStrings => {
  if (disabled || !locations.length) return {};

  return locations.reduce((accum, {id}) => {
    accum[id] = capitalCase(id);
    return accum;
  }, {} as LangStrings);
};

