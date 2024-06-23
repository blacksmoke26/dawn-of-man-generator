/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {xmlToJson} from '~/helpers/xml';

// utils
import {allEqual} from '~/helpers/array';

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

  const converted: Json = jsonToRedux(json, {
    nullResolver: (key: string) => ({[key]: false}),
  });

  if (allEqual(Object.values(converted?.environment || {}))) {
    throw new Error('XML text contains no environment data');
  }

  return converted;
};
