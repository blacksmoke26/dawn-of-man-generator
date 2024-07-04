/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

/**
 * Checks that whatever the given value is a function or not
 */
export const invokeHandler = <T extends object = object>(props: T, func: keyof T, value: unknown | unknown[] = undefined): any => {
  if (func in props && 'function' === typeof props[func]) {
    const args = value !== undefined ? [].concat(value as any) as any : [];
    return (props[func] as Function)(...args);
  }

  return undefined;
};
