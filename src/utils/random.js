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

/** Builtin environments */
export const environments: Array<string> = [
	'eurasia',
	'eurasia_north',
	'eurasia_conflict',
	'eurasia_warm',
	'eurasia_flatlands',
	'eurasia_glacial',
];

/** Builtin deposits */
export const deposits: Array<string>
	= 'Flint Tin Copper Iron Steel'.split(' ');

/** Builtin trees */
export const trees: Array<string>
	= ('Oak Birch Beech Rye Einkorn Emmer Flax BitterVetch'
	+ ' Chickpeas Lentils Peas Blackberry Blueberry Raspberry'
	+ ' Strawberry Chestnut Pear Cherry Service').split(' ');

/**
 * @param {?number} value=null - Value to set / Set null for random values
 * @param {number} fraction=2 - Fraction digits
 * @returns {{[string]: number}}
 */
export const randomFrequencies: ( value?: ?number, fraction?: number ) => {[string]: number}
	= ( value: ?number = null, fraction: number = 2 ): {[string]: number} => ({
	freq1: value === null ? randomFrequency(fraction) : Number(value),
	freq2: value === null ? randomFrequency(fraction) : Number(value),
	freq3: value === null ? randomFrequency(fraction) : Number(value),
	freq4: value === null ? randomFrequency(fraction) : Number(value),
	freq5: value === null ? randomFrequency(fraction) : Number(value),
	freq6: value === null ? randomFrequency(fraction) : Number(value),
	freq7: value === null ? randomFrequency(fraction) : Number(value),
	freq8: value === null ? randomFrequency(fraction) : Number(value),
});

/** Random Frequency */
export const randomFrequency: (fraction?: number) => number = (fraction: number = 2): number => Number(randomFloat(0, 1)).toFixed(fraction);
/** Random Coordinates */
export const randomCord: (fraction?: number) => number = (fraction: number = 2): number => Number(randomFloat(0, 1)).toFixed(fraction);
/** Random Name */
export const randomName: () => string = (): string => slugify(faker.address.city('{{name.cityPrefix}}').toLowerCase(),'_');
/** Random Seed */
export const randomSeed: () => string = () => String(randomInt(0, 11111111)).padStart(8, '0');
/** Random Environment */
export const randomEnvironment: () => string = (): string => faker.random.arrayElement(environments);
/** Random Lakes */
export const randomLakes: () => number = (): number => randomInt(0, 9);
/** Random River */
export const randomRiver: () => boolean = (): boolean => faker.random.arrayElement([true, false]);
/** Random Deposits */
export const randomDeposits: ( counts?: number ) => boolean = ( counts: number = 2 ): Array<string> => {
	const rand: Function = uniqueRandomArray(deposits);
	const list: Array<string> = [];
	
	for ( let i = 1; i <= counts; i++ ) {
		list.push(rand());
	}
	
	return list;
};
/** Random Trees */
export const randomTrees: ( counts?: number ) => boolean = ( counts: number = 5 ): Array<string> => {
	const rand: Function = uniqueRandomArray(trees);
	const list: Array<string> = [];
	
	for ( let i = 1; i <= counts; i++ ) {
		list.push(rand());
	}
	
	return list;
};
