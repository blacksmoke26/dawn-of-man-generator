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

// Location properties
export interface LocationProps {
  _id: string;
  name: string;
  slug: string;
  seed: string;
  coordinates: [number, number];
  position?: [number, number];
  positionEnabled?: boolean;
  river: boolean;
  environment: string;
  lakes: number;
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
 * Random Environment */
export const randomEnvironment = (): string => (uniqueRandomArray(environments)() as string);

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
  randomInt(0, 1024),
  randomInt(0, 1024)
];


/**
 * @public
 * @static
 * Randomize location values */
export const randomizeLocation = (): LocationProps => {
  const coordinates = randomCoordinates();
  const name = randomName();

  return {
    _id: nanoid(7),
    ...name,
    seed: randomSeed(),
    coordinates,
    river: randomRiver(),
    environment: randomEnvironment(),
    lakes: randomLakes(),
    position: randomPosition()
  };
};

/**
 * @public
 * @static
 * Convert a location object into template */
export const nodeToTemplate = (location: LocationProps): string => {
  const {slug, seed, coordinates, river, environment, lakes, position, positionEnabled} = location;

  const riverProp: string = ` river="${river ? 'true' : 'false'}"`;
  const lakesProp: string = Number(lakes) ? ` lakes="${lakes}"` : '';
  const positionStr = positionEnabled ? `map_position="${position?.[0] as number},${position?.[1] as number}"` : '';

  return (
    `<location id="${slug}"
			seed="${String(seed).padStart(8, '0')}"
			environment="${environment}"
			map_location="${coordinates[0]},${coordinates[1]}"
			${positionStr}
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

