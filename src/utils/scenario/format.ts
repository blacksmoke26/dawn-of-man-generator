/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

/**
 * Format value as a period (e.g. 10y)
 * @param value - Value to format
 * @returns Formatted value
 */
export const formatPeriod = (value: number | string): string => {
  return +parseFloat(String(value)).toFixed(2) + 'y';
};
