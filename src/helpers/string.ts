/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

/** Converts a given value into a string */
export const toString = <T extends string = string>(value: any, defaultValue: T = '' as T): T => {
  const str = String(value || '').toString().trim() as T;
  return !str ? defaultValue : str;
};

/**
 * Checks that the given value is a string or not
 */
export const isString = (value: any, checkEmpty: boolean = false): boolean => {
  if ('string' !== typeof value) {
    return false;
  }

  return checkEmpty ? Boolean(value?.trim()) : true;
};
