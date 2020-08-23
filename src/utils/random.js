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

/** Props types */
export const props: Array<string> = [
	'BigRocks', 'MediumRocks', 'Megalith',
	'Flint', 'SmallRocks', 'RiverRocks',
];

/** Details types */
export const details: Array<string> = [
	'DetailGrass', 'DetailReeds', 'DetailFlowers',
	'GroundPlant', 'DetailStick',
];

/** Trees types */
export const trees: Array<string> = [
	'Pear', 'Cherry', 'Service', 'Chestnut', 'Oak',
	'Fir', 'Pine', 'Spruce', 'Beech', 'Birch',
	'Barley', 'Rye', 'Einkorn', 'Emmer', 'Flax',
	'BitterVetch', 'Chickpeas', 'Lentils', 'Peas', 'Blackberry',
	'Blueberry', 'Raspberry', 'Strawberry',
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

/** Random Humidity */
export function randomHumidity (): [number, number] {
	return [
		Number(randomFloat(Defaults.HUMIDITY_MIN, Defaults.HUMIDITY_MAX)).toFixed(2),
		Number(randomFloat(Defaults.HUMIDITY_MIN, Defaults.HUMIDITY_MAX)).toFixed(2)
	];
}

/** Random backdrop Scale */
export function randomBackdropScale (): [number, number, number] {
	return [
		Number(randomFloat(0, 1)).toFixed(2),
		Number(randomFloat(0, 1)).toFixed(2),
		Number(randomFloat(0, 1)).toFixed(2),
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

/** Random Trees Everywhere */
export function randomTreesEverywhere (): boolean {
	return faker.random.arrayElement([true, false]);
}

/**
 * Random Frequencies
 */
export function randomFrequencies ( value: ?number = null, fraction: number = 2 ): {[string]: number} {
	const frequencies: Array<string> = [
		'freq1', 'freq2', 'freq3', 'freq4',
		'freq5', 'freq6', 'freq7', 'freq8',
	];
	
	const finalObj: {[string]: number} = {};
	
	for ( let f of frequencies ) {
		finalObj[f] = Number(value) || randomFrequency(fraction);
	}
	
	return finalObj;
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
