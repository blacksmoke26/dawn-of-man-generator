/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import merge from 'deepmerge';
import {Json} from '~/types/json.types';

/**
 * Merges multiple objects into one mega object
 * @param obj The object
 * @return The merged object
 */
export const mergeAll = <T = Record<string, any>>(...obj: T[]): T => {
  let combined = {} as T;

  for (const o of obj) {
    combined = merge<T>(combined, o);
  }

  return combined;
};

/**
 * @public
 * @static
 * Check that given value is object
 */
export const isObject = (obj: any): boolean => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

/**
 * Get the object with only provided keys
 * @param obj - Plain object
 * @param keys - List of fields to have only
 * @param [excludeMode=false] - Reverse: Skip those fields which are provided in `keys`
 *
 * @example Include mode
 * const result = onlyKeys({a: 1, b: 2, c: 3}, ['a', 'b']);
 * console.log('Result:', result); // {a: 1, b: 2}
 *
 * @example Exclude mode (`excludeMode` param as true)
 * const result = onlyKeys({a: 1, b: 2, c: 3}, ['a', 'b'], true);
 * console.log('Result:', result); // {c: 3}
 */
export const onlyKeys = <T extends Record<string, any> = Record<string, any>>(obj: T, keys: (keyof T | string)[] = [], excludeMode: boolean = false): T => {
  const objKeys = Object.keys(obj as Record<string, any>);

  if (!objKeys.length || !keys.length) return {} as T;

  const normalized = objKeys
    .filter(key => excludeMode ? !keys.includes(key) : keys.includes(key))
    .map((key) => [key, (obj as Record<string, any>)[key]]);

  return Object.fromEntries(normalized) as T;
};

/**
 * Deep copy object and return a shallow copy
 */
export const cloneObject = <T extends Json = Json>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};
