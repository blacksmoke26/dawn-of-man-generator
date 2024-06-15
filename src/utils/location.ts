/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import slugify from 'slugify';
import {nanoid} from 'nanoid';
import randomInt from 'random-int';
import {faker} from '@faker-js/faker';
import randomFloat from 'random-float';
import uniqueRandomArray from 'unique-random-array';

// utils
import {POSITION_MIN, POSITION_MAX} from '~/utils/defaults';

// Location properties
export interface LocationProps {
  _id: string;
  name: string;
  slug: string;
  seed: string;
  environment: string;
  coordinates: [number, number];
  positionEnabled?: boolean;
  position?: [number, number];
  riverEnabled?: boolean;
  river?: boolean;
  lakesEnabled?: boolean;
  lakes?: number;
}

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
  return +randomFloat(0, 1).toFixed(2);
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
  const slug: string = slugify(name.toLowerCase(), {replacement: '_'});
  return {name, slug};
};

/**
 * @public
 * @static
 * Random Seed */
export const randomSeed = (): string => String(randomInt(0, 99999999)).padStart(8, '0');

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
export const randomLakes = (): number => randomInt(0, 5);

/**
 * @public
 * @static
 * Random River */
export const randomRiver = (): boolean => uniqueRandomArray([true, false])();

export const randomPosition = (): [number, number] => [
  randomInt(POSITION_MIN, POSITION_MAX),
  randomInt(POSITION_MIN, POSITION_MAX)
];

/**
 * @public
 * @static
 * @param [customEnvironments] - List of custom environments
 * Randomize location values */
export const randomizeLocation = (customEnvironments: string[] = []): LocationProps => {
  const coordinates = randomCoordinates();
  const name = randomName();

  return {
    _id: nanoid(7),
    ...name,
    seed: randomSeed(),
    coordinates,
    river: randomRiver(),
    environment: randomEnvironment(customEnvironments),
    lakes: randomLakes(),
    position: randomPosition()
  };
};

/**
 * @public
 * @static
 * Convert a location object into template */
export const nodeToTemplate = (location: LocationProps): string => {
  const {slug, seed, coordinates, river, environment, lakes, position} = location;

  const riverProp: string = location.riverEnabled ? ` river="${river ? 'true' : 'false'}"` : '';
  const lakesProp: string = location.lakesEnabled ? (Number(lakes) ? ` lakes="${lakes}"` : '') : '';
  const positionProp: string = location.positionEnabled ? `position="${position?.[0] as number},${position?.[1] as number}"` : '';

  return (
    `<location id="${slug}"
			seed="${String(seed).padStart(8, '0')}"
			environment="${environment}"
			map_location="${coordinates[0]},${coordinates[1]}"
			${positionProp}
			${riverProp} ${lakesProp}
		/>`
  );
};

/**
 * @public
 * @static
 * Convert location nodes into language strings */
export const nodesToLanguageStrings = (nodes: LocationProps[]): Record<string, string> => {
  const list: Record<string, string> = {};

  for (const {name, slug} of nodes) {
    list[slug] = name;
  }

  return list;
};

