/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

// types
import type {Json} from '~/types/json.types';

/**
 * Checks whether the given key exists in the given collection and cannot be empty or undefined.
 * @param key - The key to check
 * @param attributes - The attributes to check
 * @returns true if the key exists and valid, false otherwise
 */
export const isKeyInAtt = <Attr extends object = Json>(key: keyof Attr, attributes: Attr): boolean => {
  return key in attributes
    && attributes?.[key] !== undefined
    && attributes?.[key] !== '';
};

/**
 * Render an XML tag with attributes and inner text
 * @param name - Tag name (e.g. `tag`)
 * @param type - Value for `type` attribute, null to ignore
 * @param attributes - Attributes
 * @param [text] - inner text (e.g. `<tag>INNER_TEXT</tag>`)
 * @returns XML string
 */
export const renderTemplate = (name: string, type: string | null, attributes: string[], text: string = ''): string => {
  const collection: string[] = [name];

  if ( type !== null ) {
    collection.push(`type="${type}"`);
  }

  collection.push(...attributes);

  const begin = `${collection.join(' ')}`;

  return !text.trim() ? `<${begin}/>` : `<${begin}>${text}</${name}>`;
};

/**
 * Omit empty properties from the given values object
 * @param values - The values
 * @returns Filtered values object
 */
export const filterEmpty = <T = Json>(values: T): T => {
  const filtered = {} as Json;

  for (const [name, value] of Object.entries(values as Json)) {
    if (value !== '' && value !== undefined) {
      filtered[name] = value;
    }
  }

  return filtered as T;
};
