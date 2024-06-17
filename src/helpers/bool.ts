/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

/**
 * Checks that the given value is a boolean or not
 */
export const isBool = (value: any): boolean => {
  return 'boolean' === typeof value;
};
