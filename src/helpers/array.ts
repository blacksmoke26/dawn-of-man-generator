/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

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
