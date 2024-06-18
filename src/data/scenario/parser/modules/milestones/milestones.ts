/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import merge from 'deepmerge';
import op from 'object-path';

// utils
import {isObject} from '~/helpers/object';
import {isString} from '~/helpers/string';

// parsers
import {parseConditions} from '../condition/utils/condition';

// types
import type {Json} from '~/types/json.types';
import type {Required} from 'utility-types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';
import type {TransformOverrideObjectOptions} from '~/utils/parser/transform.types';


/** Convert `scenario.milestones` json into redux data */

export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  const opt = merge<Required<TransformOverrideObjectOptions>>({
    nullResolver: () => ({}),
  }, options);

  const nullValue = opt.nullResolver('milestones');

  const parsed = op.get<Json | Json[] | null>(json, 'scenario.milestones.milestone', null);

  if (parsed === null || (!isObject(parsed) && !Array.isArray(parsed))) {
    return nullValue;
  }

  const milestones = (isObject(parsed) ? [parsed] : parsed) as Json[];
  const collection: Json[] = [];

  if (!milestones.length) {
    return nullValue;
  }

  for (const milestone of milestones) {
    if (!isObject(milestone)) {
      continue;
    }

    const id = op.get<string>(milestone, 'id', '');

    if (isString(id) && id.trim()) {
      collection.push({
        id,
        conditions: parseConditions(milestone),
      });
    }
  }

  return !collection.length
    ? nullValue
    : {milestones: collection};
};
