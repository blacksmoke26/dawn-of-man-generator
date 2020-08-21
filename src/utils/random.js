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

// Utils
import * as Defaults from './defaults';

/** Builtin environments */
export const environments: Array<string> = [
	'eurasia', 'eurasia_conflict', 'eurasia_flatlands',
	'eurasia_glacial', 'eurasia_north', 'eurasia_warm', 'flat',
];

/** Deposits types */
export const deposits: Array<string> = [
	'Flint', 'Tin', 'Copper', 'Iron',
];

/** Trees types */
export const trees: Array<string> = [
	'Oak', 'Birch', 'Beech', 'Rye', 'Einkorn', 'Emmer', 'Flax', 'BitterVetch',
	'Chickpeas', 'Lentils', 'Peas', 'Blackberry', 'Blueberry', 'Raspberry',
	'Strawberry', 'Chestnut', 'Pear', 'Cherry', 'Service',
];

/** Random Frequency */
export function randomFrequency ( fraction: number = 2 ): number {
	return Number(randomFloat(0, 1)).toFixed(fraction);
}

/** Random Density */
export function randomDensity ( fraction: number = 2 ): number {
	return Number(randomFloat(Defaults.DENSITY_MIN, Defaults.DENSITY_MAX)).toFixed(fraction);
}

/** Random Coordinates */
export function randomCord ( fraction: number = 2 ): number {
	return Number(randomFloat(0, 1)).toFixed(fraction);
}

/** Random Angle */
export function randomAngle (): [number, number] {
	return [
		randomInt(Defaults.ANGLE_MIN, 40),
		randomInt(41, Defaults.ANGLE_MAX)
	];
}

/** Random Altitude */
export function randomAltitude (): [number, number] {
	return [
		randomInt(Defaults.ALTITUDE_MIN, 10),
		randomInt(11, Defaults.ALTITUDE_MAX)
	];
}

/** Random Name */
export function randomName (): string {
	return slugify(faker.address.city('{{name.cityPrefix}}').toLowerCase(),'_');
}

/** Random Seed */
export function randomSeed (): string {
	return String(randomInt(0, 11111111)).padStart(8, '0');
}

/** Random Environment */
export function randomEnvironment (): string {
	return faker.random.arrayElement(environments);
}

/** Random Lakes */
export function randomLakes (): number {
	return randomInt(0, 9);
}

/** Random River */
export function randomRiver (): boolean {
	return faker.random.arrayElement([true, false]);
}

/**
 * @param {?number} value=null - Value to set / Set null for random values
 * @param {number} fraction=2 - Fraction digits
 * @returns {{[string]: number}}
 */
export function randomFrequencies ( value: ?number = null, fraction: number = 2 ): {[string]: number} {
	return {
		freq1: value === null ? randomFrequency(fraction) : Number(value),
		freq2: value === null ? randomFrequency(fraction) : Number(value),
		freq3: value === null ? randomFrequency(fraction) : Number(value),
		freq4: value === null ? randomFrequency(fraction) : Number(value),
		freq5: value === null ? randomFrequency(fraction) : Number(value),
		freq6: value === null ? randomFrequency(fraction) : Number(value),
		freq7: value === null ? randomFrequency(fraction) : Number(value),
		freq8: value === null ? randomFrequency(fraction) : Number(value),
	};
}

/** Random Deposits */
export function randomDeposits ( counts: number = 2 ): Array<string> {
	const rand: Function = uniqueRandomArray(deposits);
	const list: Array<string> = [];
	
	for ( let i = 1; i <= counts; i++ ) {
		list.push(rand());
	}
	
	return list;
}

/** Random Trees */
export function randomTrees ( counts: number = 5 ): Array<string> {
	const rand: Function = uniqueRandomArray(trees);
	const list: Array<string> = [];
	
	for ( let i = 1; i <= counts; i++ ) {
		list.push(rand());
	}
	
	return list;
}
