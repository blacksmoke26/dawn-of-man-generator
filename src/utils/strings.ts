/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-16
 * @version 2.2
 */

// types
import {KVDocument} from '~/types/json.types';

export interface LangStrings {
  [key: string]: string;
}

/**
 * Convert strings dictionary to language string.
 * @param strings - Strings dictionary.
 * @returns Language string.
 */
export const toLanguageString = (strings: LangStrings): string => {
  const texts: string[] = [];

  for (const [name, value] of Object.entries(strings)) {
    value.trim() && texts.push(
      `<string name="${String(name).replace(/['"]/ig, '')}">${value.trim()}</string>`,
    );
  }

  return texts.join('\n');
};

/**
 * Build a list of strings from a JSON document.
 * @param strings JSON document with strings.
 * @returns List of strings.
 */
export const buildStrings = (strings: KVDocument<string>): LangStrings => {
  const list: LangStrings = {};

  for (const [key, value] of Object.entries(strings)) {
    if (key.trim() && value.trim()) {
      list[key.trim()] = value.trim();
    }
  }

  return list;
};

