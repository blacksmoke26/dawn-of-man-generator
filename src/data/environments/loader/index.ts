/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import * as XML from '~/helpers/xml';

// Utils
import {jsonToRedux} from './../parser/index';

/**
 * @private
 * @static
 * Check that array values are equal */
const allEqual = <T = any>(arr: T[]): boolean => arr.every(v => v === arr[0]);

/**
 * @public
 * @static
 * Convert XML to JSON
 * @throws {Error} - Failed to parse xml
 */
export const xmlToJson = (xml: string): { [p: string]: any } => {
  try {
    return XML.parse(xml, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
      parseAttributeValue: true,
      parseTagValue: true,
      trimValues: true,
      allowBooleanAttributes: true,
    });
  } catch (e) {
    throw e;
  }
};

/**
 * @public
 * @static
 * Convert XML to Redux JSON
 * @throws {Error} - Failed to parse xml
 */
export const xmlToReduxJson = (xml: string): { [p: string]: any } => {
  const json: { [p: string]: any } = xmlToJson(xml);

  if (!('environment' in json)) {
    throw new Error('Not a valid environment XML');
  }

  const converted: { [p: string]: any } = jsonToRedux(json, {
    nullResolver: (key: string) => ({[key]: false}),
  });

  if (allEqual(Object.values(converted?.environment || {}))) {
    throw new Error('XML text contains no environment data');
  }

  return converted;
};
