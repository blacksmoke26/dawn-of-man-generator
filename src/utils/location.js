// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-10
 */

import slugify from 'slugify';
import faker from 'faker';
import randomFloat from 'random-float';
import randomInt from 'random-int';
import uniqueRandomArray from 'unique-random-array';

// Location properties
export type LocationProps = {
	name: string,
	seed: string,
	coordinates: [number, number],
	river: boolean,
	environment: string,
	lakes: number,
};

/** Builtin environments */
export const environments: Array<string> = [
	'eurasia', 'eurasia_conflict', 'eurasia_flatlands',
	'eurasia_glacial', 'eurasia_north', 'eurasia_warm', 'flat',
];

/**
 * @public
 * @static
 * Random Coordinate */
export function randomCoordinate (): number {
	return randomFloat(0, 1).toFixed(2);
}

/**
 * @public
 * @static
 * Random Coordinates */
export function randomCoordinates (): [number, number] {
	return [
		randomCoordinate(),
		randomCoordinate(),
	];
}

/**
 * @public
 * @static
 * Random Name */
export function randomName (): { name: string, slug: string } {
	const name: string = faker.address.city('{{name.cityPrefix}}');
	const slug: string = slugify(name.toLowerCase(), {replacement: '_'});
	return {name, slug}
}

/**
 * @public
 * @static
 * Random Seed */
export function randomSeed (): string {
	return String(randomInt(0, 99999999)).padStart(8, '0');
}

/**
 * @public
 * @static
 * Random Environment */
export function randomEnvironment (): string {
	return uniqueRandomArray(environments)();
}

/**
 * @public
 * @static
 * Random Lakes */
export function randomLakes (): number {
	return randomInt(0, 5);
}

/**
 * @public
 * @static
 * Random River */
export function randomRiver (): boolean {
	return uniqueRandomArray([true, false])();
}

/**
 * @public
 * @static
 * Randomize location values */
export function randomizeLocation (): LocationProps {
	const coordinates = randomCoordinates()
	
	return {
		name: randomName().slug,
		seed: randomSeed(),
		coordinates,
		river: randomRiver(),
		environment: randomEnvironment(),
		lakes: randomLakes(),
	};
}

