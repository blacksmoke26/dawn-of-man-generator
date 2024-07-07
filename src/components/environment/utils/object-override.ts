/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

import React from 'react';

// utils
import * as objects from '~/utils/objects';
import {isNumeric} from '~/helpers/number';

// types
import type {Option} from '~/components/ui/Select';
import type {ObjectType} from '~/utils/objects';
import type {Json, KVDocument} from '~/types/json.types';
import type {environment} from '~/data/environments/parser/types';

export type ObjectsList = environment.OverridePrototypes<string>;

export interface Props {
  type: ObjectType;
  checked?: boolean;
  noCard?: boolean;
  objectNoCard?: boolean;
  optionIcon?: React.ReactElement;
  values?: ObjectsList;

  onChange?(template: string): void;
}

/**
 * Returns the list of objects for the given type
 * @param type - The type of object
 */
export const typeToList = (type: ObjectType) => {
  switch (type) {
    case 'deposit':
      return objects.deposits;
    case 'prop':
      return objects.props;
    case 'tree':
      return objects.trees;
    case 'detail':
      return objects.details;
  }
};

/**
 * Returns react-select options by given type
 * @param type - The type of object
 * @param [excluded] - The list of excluded values
 * @returns The react-select options
 */
export const optionsByType = (type: ObjectType, excluded: string[] = []): Option[] => {
  const options: Option[] = [];

  const list = typeToList(type) as unknown as string[];
  const excludedCount = excluded.length;

  for (const value of list) {
    if (excludedCount && excluded.includes(value)) {
      continue;
    }

    options.push({label: value, value});
  }

  return options;
};

/**
 * Generates the template text for the given type and values
 * @param type - The type of object
 * @param values - The values of the object
 * @returns The template text
 */

export const toTemplateText = (type: ObjectType, values: KVDocument<string>): string => {
  const template = Object.values(values).join('').trim();

  return !template.length ? '' : !template ? '' : (
    `<${type}_override_prototypes>
      ${template}
    </${type}_override_prototypes>`
  );
};

/**
 * Converts the values to templates
 * @param values - The values of the object
 * @returns The values to templates
 */
export const valuesToTemplates = (values: ObjectsList | undefined): KVDocument<string> => {
  const templates: KVDocument<string> = {};
  Object.keys(values || {}).forEach(id => {
    templates[id] = '';
  });
  return templates;
};

/**
 * Convert Redux data into component prop values
 * @param data - The Redux data
 * @returns The component prop values
 */
export const extValueToSelection = (data: Json = {}): ObjectsList => {
  const selection: ObjectsList = {};
  for (const [name, attr] of Object.entries(data)) {
    const attributes: ObjectsList = {};

    isNumeric(attr?.density) && (attributes.density = attr.density);
    Array.isArray(attr?.angle) && (attributes.angle = attr.angle);
    Array.isArray(attr?.humidity) && (attributes.humidity = attr.humidity);
    Array.isArray(attr?.altitude) && (attributes.altitude = attr.altitude);

    selection[name] = attributes;
  }

  return selection;
};
