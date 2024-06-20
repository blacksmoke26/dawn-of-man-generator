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

export interface UseValuesHook<T extends object> {
  /**
   * Get all values
   */
  getAll(): T;

  /**
   * Get value by key
   * @param key - The key (e.g., 'enabled')
   * @param defaultValue - Default value if the key is not found
   */
  getValue<R = any>(key: keyof T, defaultValue?: R | undefined): R;

  /**
   * Get value by path
   * @param path - The Path (e.g., 'a.b.c' | ['a', 'b', 'c'] | '0.a.3.c')
   * @param defaultValue - Default value if the path is not found
   */
  getValue<R = any>(path: Path, defaultValue?: R | undefined): R;

  /**
   * Set value by key
   * @param key - The key (e.g., 'enabled')
   * @param value - Value to set / A callback function to get the value
   * @example Default behavior is to set the value
   * setValue<boolean>('enabled', false);
   * @example A callback function can be used to set the value
   * setValue<boolean>('enabled', (state) => !state);
   * @param checkUndefined - If true, the value as undefined work by set and ignore the setting process
   */
  setValue<V = any>(key: keyof T, value: ValueType<V>, checkUndefined?: boolean): void;

  /**
   * Set value by path
   * @param path - The Path (e.g., 'a.b.c' | ['a', 'b', 'c'] | '0.a.3.c')
   * @param value - Value to set / A callback function to get the value
   * @example Default behavior is to set the value
   * setValue<number>('a.b.c', 3);
   * @example Default behavior is to set the value
   * setValue<number>('a.b.c', (num) => num + 1);
   * @param checkUndefined - If true, the value as undefined work by set and ignore the setting process
   */
  setValue<V = $Values<T> | any>(path: Path, value: ValueType<V>, checkUndefined?: boolean): void;

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
   * @returns true if path exists, false otherwise
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
