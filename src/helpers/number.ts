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
