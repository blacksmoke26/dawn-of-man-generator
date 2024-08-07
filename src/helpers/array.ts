/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import {isString} from '~/helpers/string';
import {Callable} from '~/helpers/number';

/**
 * Checks if the array contains all the keys in the list.
 * @param list - The list of keys.
 * @param keys - The keys to check.
 * @returns True if all the keys are in the list, false otherwise.
 */
export const hasKeysInArray = (list: string[], keys: string[]): boolean => {
  for (const key of keys) {
    if (!list.includes(key)) {
      return false;
    }
  }

  return true;
};

/**
 * Check that array values are equal */
export const allEqual = <T = any>(arr: T[]): boolean => arr.every(v => v === arr[0]);

/**
 * Check that value exists in given array */
export const isInList = <T = any>(key: T, arr: T[], callback?: Callable<T>): boolean => {
  if (!isString(key, true) || !arr.includes(key)) {
    return false;
  }

  'function' === typeof callback && callback(key);
  return true;
};


/**
 * Remove duplicate items from array */
export const filterUnique = <T = any>(ary: T[]): T[] => {
  return [...new Set(ary) as unknown as T[]];
};
