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

/**
 * Checks that the given value is numeric or not
 */
export const isNumeric = (value: any): boolean => {
  return isFloat(value) || isInt(value);
};

/**
 * Count decimals of the given value
 */
export const countDecimals = (value: any): number => {
  return !isFloat(value) ? 0 : String(value).split('.').length;
};

/**
 * Converts slider steps into decimals count
 * @param decimal - The decimal number
 * @returns The slider steps
 * @see stepToDecimal
 */
export const decimalToStep = (decimal: number): number => {
  return decimal === 0 ? 1 : +`.${''.padStart(decimal - 1, '0')}1`;
};

/**
 * Converts decimals count into slider steps
 * @param step - Step float value
 * @return The decimals count
 * @see decimalToStep
 */
export const stepToDecimal = (step: number): number => {
  return !String(step).includes('.')
    ? step
    : String(step).replace(/^.+\./g, '').length;
};
