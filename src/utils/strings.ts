/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-16
 * @version 2.2
 */

// utils
import {capitalCase, pascalCase, camelCase} from 'change-case';

// types
import type {KVDocument} from '~/types/json.types';

export interface LangStrings {
  [key: string]: string;
}

export type CaseType = 'SNAKE' | 'CAPITAL' | 'PASCAL' | 'CAMEL' | 'KEBAB' | 'DEFAULT';
export type CaseTypeFull = `${Exclude<CaseType, 'DEFAULT'>}_CASE` | 'DEFAULT';
export type EventType = 'KEYUP' | 'CHANGE';

const SANITIZE_REGEX = /[^a-z_\d]+/ig;

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

/**
 * Sanitizes a string and removes special characters from the string
 * @param str - The source string to sanitize
 * @return The sanitized string
 * @private
 */
const normalizeText = (str: string): string => {
  return String(str || '').replace(/ {2,}|[~`'"]+/ig, '');
};

/**
 * Convert a string case into a snake case (e.g. 'two_words')
 * @param str - The string
 * @param eventType - Event type to convert
 * @returns The converted string
 */
export const toSnakeCase = (str: string, eventType: EventType = 'CHANGE'): string => {
  const normalizedStr = normalizeText(str);

  return (eventType === 'KEYUP'
    ? normalizedStr.replace(SANITIZE_REGEX, `_`).toLowerCase()
    : normalizedStr.replace(SANITIZE_REGEX, `_`))
    .replace(/_+/ig, '_');
};

/**
 * Convert a string case into a kebab case (e.g. 'two-words')
 * @param str - The string
 * @param eventType - Event type to convert
 * @returns The converted string
 */
export const toKebabCase = (str: string, eventType: EventType = 'CHANGE'): string => {
  const normalizedStr = normalizeText(str);

  return (eventType === 'KEYUP'
    ? normalizedStr.replace(SANITIZE_REGEX, `-`).toLowerCase()
    : normalizedStr.replace(SANITIZE_REGEX, `-`))
    .replace(/_+/ig, '-');
};

/**
 * Convert a string case into a capital case (e.g. 'Two Words')
 * @param str - The string
 * @param eventType - Event type to convert
 * @returns The converted string
 */
export const toCapitalCase = (str: string, eventType: EventType = 'CHANGE'): string => {
  const normalizedStr = normalizeText(str);

  return (eventType === 'KEYUP'
    ? capitalCase(normalizedStr.replace(SANITIZE_REGEX, ` `))
    : normalizedStr.replace(SANITIZE_REGEX, ` `))
    .replace(/ +/ig, ' ');
};

/**
 * Convert a string case into a pascal case (e.g. 'TwoWords')
 * @param str - The string
 * @param eventType - Event type to convert
 * @returns The converted string
 */
export const toPascalCase = (str: string, eventType: EventType = 'CHANGE'): string => {
  const normalizedStr = normalizeText(str);

  return (eventType === 'KEYUP'
    ? pascalCase(normalizedStr.replace(SANITIZE_REGEX, ` `))
    : normalizedStr.replace(SANITIZE_REGEX, ` `))
    .replace(/ */ig, '');
};

/**
 * Convert a string case into a camel case (e.g. 'twoWords')
 * @param str - The string
 * @param eventType - Event type to convert
 * @returns The converted string
 */
export const toCamelCase = (str: string, eventType: EventType = 'CHANGE'): string => {
  const normalizedStr = normalizeText(str);

  return (eventType === 'KEYUP'
    ? camelCase(normalizedStr.replace(SANITIZE_REGEX, ``))
    : normalizedStr.replace(SANITIZE_REGEX, ``))
    .replace(/ */ig, '');
};

export function toTextCase(str: string, caseType?: CaseType, eventType?: EventType): string;
export function toTextCase(str: string, caseType?: CaseTypeFull, eventType?: EventType): string;
/**
 * Transform the given string case into the corresponding case based on the event type
 * @param str - The source string to transform
 * @param [caseType] - Case type
 * @param [eventType] - Event type
 * @returns The transformed value
 */
export function toTextCase(str: string, caseType = 'DEFAULT', eventType: EventType = 'CHANGE'): string {
  // Note: We will omit the case part of the string, considering a compact version of case
  const theCase = caseType.replace('_CASE', '') as CaseType;

  switch (theCase) {
    case 'SNAKE':
      return toSnakeCase(str, eventType);
    case 'CAPITAL':
      return toCapitalCase(str, eventType);
    case 'PASCAL':
      return toPascalCase(str, eventType);
    case 'KEBAB':
      return toKebabCase(str, eventType);
    case 'CAMEL':
      return toCamelCase(str, eventType);
    default:
      return normalizeText(str);
  }
}
