/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

/** Converts a given value into an integer */
export const toInteger = (value: any, defaultValue: number = 0) => {
  const casted = parseInt(String(value), 10);
  return isNaN(casted) ? defaultValue : casted;
};

/** Converts a given value into a float */
export const toFloat = (value: any, decimals: number = 2, defaultValue: number = 0) => {
  const casted = parseFloat(String(value));
  return isNaN(casted) ? defaultValue : +casted.toFixed(decimals);
};

/**
 * Checks that the given value is an integer or not
 */
export const isInt = (value: any): boolean => {
  return 'number' === typeof value && Number.isInteger(value);
};

/**
 * Checks that the given value is a float or not<br>
 * Taken from: https://stackoverflow.com/a/3885844
 */
export const isFloat = (value: any): boolean => {
  return 'number' === typeof value && (value === +value && value !== (value | 0));
};
