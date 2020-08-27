// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-10
 */

import faker from 'faker';
import randomFloatMod from 'random-float';
import randomInt from 'random-int';
import uniqueRandomArray from 'unique-random-array';

// Utils
import * as Defaults from './defaults';

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

/** Random float number  */
export function randomFloat ( fraction: number = 2 ): number {
	return Number(randomFloatMod(0, 1).toFixed(fraction));
}

/** Random array */
export function randomArray ( list: Array<any>, counts: number ): list {
	const rand: Function = uniqueRandomArray(list);
	
	const newList: Array<string> = [];
	
	for ( let i = 1; i <= counts; i++ ) {
		newList.push(rand());
	}
	
	return newList;
}

/** Random Frequency */
export function randomFrequency (): number {
	return Number(randomFloatMod(0, 1).toFixed(3));
}

/** Random Resource */
export function randomResource (): number {
	return randomInt(Defaults.RESOURCE_FACTOR_MIN, Defaults.RESOURCE_FACTOR_MAX);
}

/** Random Density */
export function randomDensity ( fraction: number = 2 ): number {
	return Number(randomFloatMod(Defaults.DENSITY_MIN, Defaults.DENSITY_MAX)).toFixed(fraction);
}

/** Random Angle */
export function randomAngle (): [number, number] {
	return [
		randomInt(Defaults.ANGLE_MIN, 40),
		randomInt(41, Defaults.ANGLE_MAX)
	];
}

/** Random season temperature */
export function randomSeasonTemperature (): [number, number] {
	return [
		randomInt(Defaults.SEASON_TEMPERATURE_MIN, -1),
		randomInt(0, Defaults.SEASON_TEMPERATURE_MAX)
	];
}

/** Random Humidity */
export function randomHumidity (): [number, number] {
	return [
		Number(randomFloatMod(Defaults.HUMIDITY_MIN, 0.50)).toFixed(2),
		Number(randomFloatMod(0.51, Defaults.HUMIDITY_MAX)).toFixed(2)
	];
}

/** Random backdrop Scale */
export function randomBackdropScale (): [number, number, number] {
	return [
		Number(randomFloatMod(0, 1)).toFixed(2),
		Number(randomFloatMod(0, 1)).toFixed(2),
		Number(randomFloatMod(0, 1)).toFixed(2),
	];
}

/** Random Altitude */
export function randomAltitude (): [number, number] {
	return [
		randomInt(Defaults.ALTITUDE_MIN, 10),
		randomInt(11, Defaults.ALTITUDE_MAX)
	];
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
export function randomFrequencies ( value: ?number = null ): {[string]: number} {
	const frequencies: Array<string> = [
		'freq1', 'freq2', 'freq3', 'freq4',
		'freq5', 'freq6', 'freq7', 'freq8',
	];
	
	const finalObj: {[string]: number} = {};
	
	for ( let f of frequencies ) {
		finalObj[f] = value ?? randomFrequency();
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
