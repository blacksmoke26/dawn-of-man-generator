/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-16
 * @version 2.2
 */

// types
import {KVDocument} from '~/types/json.types';

export type Dictionary = KVDocument<string>;

/**
 * Convert strings dictionary to language string.
 * @param strings - Strings dictionary.
 * @returns Language string.
 */
export const toLanguageString = (strings: Dictionary): string => {
  const texts: string[] = [];

  for (const [name, value] of Object.entries(strings)) {
    value.trim() && texts.push(
      `<string name="${String(name).replace(/['"]/ig, '')}">${value.trim()}</string>`,
    );
  }

  return texts.join('\n');
};
