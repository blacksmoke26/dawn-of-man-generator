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
import {LOCATION_LAKES_MAX, LOCATION_LAKES_MIN} from '~/utils/scenario/defaults';

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
export const randomLakes = (): number => randomInt(LOCATION_LAKES_MIN, LOCATION_LAKES_MAX);

/**
 * @public
 * @static
 * Random River */
export const randomRiver = (): boolean => uniqueRandomArray([true, false])();

export const randomPosition = (): [number, number] => [
  randomInt(POSITION_MIN, POSITION_MAX),
  randomInt(POSITION_MIN, POSITION_MAX),
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
    position: randomPosition(),
  };
};

/**
 * @public
 * @static
 * Convert a location object into template */
export const nodeToTemplate = (location: LocationProps): string => {
  if (!location?.slug?.trim()
    || !location?.seed?.trim()
    || !location?.environment?.trim()
    || !location?.coordinates?.length
  ) return '';

  const attributes: string[] = [
    `id="${location?.slug}"`,
    `seed="${String(location?.seed).padStart(8, '0')}"`,
    `environment="${location?.environment}"`,
    `map_location="${location?.coordinates[0]},${location?.coordinates[1]}"`,
  ];

  location?.riverEnabled && attributes.push(`river="${'' + location?.river}"`);
  (location?.lakesEnabled && !!location?.lakes) && attributes.push(`lakes="${location?.lakes}"`);
  location?.positionEnabled && attributes.push(`position="${location?.position?.[0] as number},${location?.position?.[1] as number}"`);

  return (
    `<location ${attributes.join(' ')}/>`
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

