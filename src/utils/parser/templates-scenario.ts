/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-08
 * @version 2.5.0
 */

// utils
import {toRootTemplate} from '~/helpers/xml';
import {toLanguageString} from '~/utils/strings';

// types
import {Json, KVDocument} from '~/types/json.types';

/** Generate scenario code */
export const toScenarioTemplate = (templates: string[]): string => {
  return toRootTemplate('scenario', templates)
};

/** Generate strings xml code */
export const toStringsTemplate = (strings: KVDocument<string | Json>): string => {
  const templates: string[] = [];

  for (const nodes of Object.values(strings)) {
    if ('string' === typeof nodes) {
      templates.push(nodes);
      continue;
    }

    templates.push(toLanguageString(nodes));
  }

  return toRootTemplate('strings', templates, {collapseContent: true})
};
