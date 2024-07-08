/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-08
 * @version 2.5.0
 */

// utils
import {isBool} from '~/helpers/bool';
import {isInt} from '~/helpers/number';
import {isObject} from '~/helpers/object';
import {renderTemplate} from '~/utils/template';

// types
import {scenario} from '~/data/scenario/parser/types';

/** Generate `location` xml code */
export const toLocationTemplate = (location: scenario.Location): string => {
  const hasEmptyNames = !location?.id?.trim()
    || !location?.environment?.trim();

  if (hasEmptyNames || !String(location?.seed).trim()
    || !location?.mapLocation?.length
  ) return '';

  const props: string[] = [
    `id="${location?.id}"`,
    `seed="${String(location?.seed).padStart(8, '0')}"`,
    `environment="${location?.environment}"`,
    `map_location="${location.mapLocation.join(',')}"`,
  ];

  Array.isArray(location?.position)
  && props.push(`position="${location.position.join(',')}"`);

  isBool(location?.river) && props.push(`river="${location?.river}"`);
  isInt(location?.lakes) && props.push(`lakes="${location?.lakes}"`);

  return renderTemplate('location', null, props);
};

/** Generate `locations` xml code */
export const toLocationsTemplate = (list: string[] | scenario.Location[], disabled: boolean = false): string => {
  if (disabled || !list.length) return '';

  const texts: string[] = [];

  for (const data of list) {
    if ('string' === typeof data && data.trim()) {
      texts.push(data);
      continue;
    }

    if (isObject(data)) {
      texts.push(toLocationTemplate(data as scenario.Location));
    }
  }

  return !texts.length ? '' : renderTemplate('locations', null, [], texts.join(''));
};
