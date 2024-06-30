/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
 */

import {Path} from 'object-path';

// types
import {$Values} from 'utility-types';

export type ValueType<V = any> = V | ((value: V) => V);

export interface UseValuesHook<T extends object, RT = any> {
  /**
   * Get immutable data values
   */
  readonly data: T;

  /**
   * Get all values
   */
  getAll(): T;

  /**
   * Get value by key
   * @param key - The key (e.g., 'enabled')
   * @param defaultValue - Default value if the key is not found
   */
  get<R = RT>(key: keyof T, defaultValue?: R | undefined): R;

  /**
   * Get value by path
   * @param path - The Path (e.g., 'a.b.c' | ['a', 'b', 'c'] | '0.a.3.c')
   * @param defaultValue - Default value if the path is not found
   */
  get<R = RT>(path: Path, defaultValue?: R | undefined): R;

  /**
   * Compare given value with the attribute's value
   * @param key - The key (e.g., 'enabled')
   * @param compare - The value to compare
   * @return True if equal or false otherwise
   */
  is<R = RT>(key: keyof T, compare?: R | R[]): boolean;

  /**
   * Compare given value with the attribute's value
   * @param path - The Path (e.g., 'a.b.c' | ['a', 'b', 'c'] | '0.a.3.c')
   * @param compare - The value to compare
   * @return True if equal or false otherwise
   */
  is<R = RT>(path: Path, compare?: R): boolean;

  /**
   * Set value by key
   * @param key - The key (e.g., 'enabled')
   * @param value - Value to set / A callback function to get the value
   * @example A plain value
   * setValue<boolean>('enabled', false);
   * @example Value as a callback function
   * setValue<boolean>('enabled', (state) => !state);
   * @param checkUndefined - If true, the value as undefined work by set and ignore the setting process
   */
  set<V = RT>(key: keyof T, value: ValueType<V>, checkUndefined?: boolean): void;

  /**
   * Set value by path
   * @param path - The Path (e.g., 'a.b.c' | ['a', 'b', 'c'] | '0.a.3.c')
   * @param value - Value to set / A callback function to get the value
   * @example A plain value
   * setValue<number>('a.b.c', 3);
   * @example Value as a callback function
   * setValue<number>('a.b.c', (num) => num + 1);
   * @param checkUndefined - If true, the value as undefined work by set and ignore the setting process
   */
  set<V = $Values<T> | RT>(path: Path, value: ValueType<V>, checkUndefined?: boolean): void;

  /**
   * Overwrite value by key (unlike {@link set}, it will first {@link empty} the value if it exists and then {@link set} the value)
   * @param key - The key (e.g., 'enabled')
   * @param value - Value to set / A callback function to get the value
   * @example A plain value
   * overwrite<number[]>('usersId', [1,2,3]);
   * @example Value as a callback function
   * overwrite<number[]>('usersId', (current) => current.slice(0, 2));
   * @param checkUndefined - If true, the value as undefined work by set and ignore the setting process
   */
  overwrite<V = RT>(key: keyof T, value: ValueType<V>, checkUndefined?: boolean): void;

  /**
   * Set value by path (unlike {@link set}, it will first {@link empty} the value if it exists and then {@link set} the value)
   * @param path - The Path (e.g., 'a.b.c' | ['a', 'b', 'c'] | '0.a.3.c')
   * @param value - Value to set / A callback function to get the value
   * @example A plain value
   * setValue<number[]>('online.usersId', [1,2,3]);
   * @example Value as a callback function
   * setValue<number[]>('online.usersId', (current: number[]) => current.slice(0, 2));
   * @param checkUndefined - If true, the value as undefined work by set and ignore the setting process
   */
  overwrite<V = $Values<T> | any>(path: Path, value: ValueType<V>, checkUndefined?: boolean): void;

  /**
   * Empty value by key (`string` become '', `array` become [], `object` become {})
   * @param key - The key (e.g., 'enabled')
   */
  empty(key: keyof T): void;

  /**
   * Empty value by path (`string` become '', `array` become [], `object` become {})
   * @param path - The Path (e.g., 'a.b.c' | ['a', 'b', 'c'] | '0.a.3.c')
   */
  empty(path: Path): void;

  /**
   * Clear all values
   */
  clear(): void;

  /**
   * Check if key exists
   * @param key - The key (e.g., 'enabled')
   * @returns true if key exists, false otherwise
   */
  hasKey(key: keyof T | string): boolean;

  /**
   * Check if path exists
   * @param path - The Path (e.g., 'a.b.c' | ['a', 'b', 'c'] | '0.a.3.c')
   * @returns true if a path exists, false otherwise
   */
  hasPath(path: Path): boolean;

  /**
   * Set value by key
   * @param key - The key (e.g., 'enabled')
   */
  remove(key: keyof T): void;

  /**
   * Set value by path
   * @param path - The Path (e.g., 'a.b.c' | ['a', 'b', 'c'] | '0.a.3.c')
   */
  remove(path: Path): void;

  /**
   * Set all values (overwrite)
   * @param newValues - New values to set
   */
  setAll(newValues: T): void;
}
