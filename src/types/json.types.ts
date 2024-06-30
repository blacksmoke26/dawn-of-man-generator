/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

export type Json = { [p: string]: any };

export type KVDocument<T = any> = { [p: string]: T };

/**
 * An extended version of Record, instead of accepting key as a
 * plain string, it accepts a list of values.
 *
 * @example
 * const FRUITS = ['Mango'] as const;
 *
 * type Fruit = typeof FRUITS[number];
 * const list = {'Mango': value} as MapDocument<Fruit>;
 */
export type MapDocument<Key extends string = string, Value extends any = any> = Partial<Record<Key, Value>>;
