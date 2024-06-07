/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import merge from 'deepmerge';

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
  return typeof obj === 'object' && obj !== null && ! Array.isArray(obj)
};
