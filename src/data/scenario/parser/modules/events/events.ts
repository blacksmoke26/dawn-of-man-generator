/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import merge from 'deepmerge';
import op from 'object-path';

// utils
import {isObject} from '~/helpers/object';

// types
import type {Json} from '~/types/json.types';
import type {Required} from 'utility-types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';
import type {TransformOverrideObjectOptions} from '~/utils/parser/transform.types';

/** Convert `scenario.events` json into redux data */

export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  const opt = merge<Required<TransformOverrideObjectOptions>>({
    nullResolver: () => ({}),
  }, options);

  const nullValue = opt.nullResolver('events');

  const parsed = op.get<Json | Json[] | null>(json, 'scenario.events.event', null);

  if (parsed === null || (!isObject(parsed) && !Array.isArray(parsed))) {
    return nullValue;
  }

  const eventsList = (isObject(parsed) ? [parsed] : parsed) as Json[];
  //const collection: Json[] = [];

  if (!eventsList.length) {
    return nullValue;
  }

  // TODO: Implement events parser logic here

  return nullValue;
};
