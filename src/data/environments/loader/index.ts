/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import {xmlToJson} from '~/helpers/xml';
import {isObject} from '~/helpers/object';

// parsers
import {jsonToRedux} from './../parser';

// types
import {Json} from '~/types/json.types';

/**
 * @public
 * @static
 * Convert XML to Redux JSON
 * @throws {Error} - Failed to parse xml
 */
export const xmlToReduxJson = (xml: string): Json => {
  const json = xmlToJson(xml);

  if (!('environment' in json)) {
    throw new Error('Not a valid environment XML');
  }

  const converted: Json = jsonToRedux(json);

  if (!isObject(converted?.environment) || !Object.keys(converted?.environment).length) {
    throw new Error('XML text contains no environment data');
  }

  return converted;
};
