/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-20
 * @version 2.3.0
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
  const json: Json = xmlToJson(xml);

  if (!('scenario' in json)) {
    throw new Error('Not a valid scenario XML');
  }

  const converted: Json = jsonToRedux(json, {
    nullResolver: (key: string) => ({[key]: false}),
  });

  if (allEqual(Object.values(converted?.scenario || {}))) {
    throw new Error('XML text contains no scenario data');
  }

  return converted;
};
