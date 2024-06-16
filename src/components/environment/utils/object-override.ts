/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-14
 * @version 2.1.1
 */

import React from 'react';
import PropTypes from 'prop-types';
import xmlFormatter from 'xml-formatter';

// elemental components
import {Option} from '~/components/ui/Select';

// utils
import * as objects from '~/utils/objects';

// types
import type {Json, KVDocument} from '~/types/json.types';
import type {ObjectAttributes, ObjectType} from '~/utils/objects';

export type ObjectsList = KVDocument<ObjectAttributes>;

export interface Props {
  type: ObjectType;
  checked?: boolean;
  noCard?: boolean;
  objectNoCard?: boolean;
  optionIcon?: React.ReactElement;
  values?: ObjectsList;

  onChange?(template: string): void;
}

export const defaultValues: Partial<Props> = {
  checked: true,
  noCard: false,
  objectNoCard: false,
  values: {},
};

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
  if (!Object.keys(values).length) {
    return '';
  }

  const template: string = Object.values(values).join('').trim();

  if (!template) {
    return '';
  }

  return xmlFormatter(
    `<${type}_override_prototypes>
      ${template}
    </${type}_override_prototypes>`,
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
    templates[id] = id;
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
    const attributes: ObjectAttributes = {};

    if ('density' in attr) {
      attributes.density = {
        disabled: false,
        value: attr.density,
      };
    }

    if ('angle' in attr) {
      attributes.angle = {
        disabled: false,
        min: attr.angle[0],
        max: attr.angle[1],
      };
    }

    if ('humidity' in attr) {
      attributes.humidity = {
        disabled: false,
        min: attr.humidity[0],
        max: attr.humidity[1],
      };
    }

    if ('altitude' in attr) {
      attributes.altitude = {
        disabled: false,
        min: attr.altitude[0],
        max: attr.altitude[1],
      };
    }

    selection[name] = attributes;
  }

  return selection;
};

// Properties validation
export const propTypes = {
  type: PropTypes.oneOf(objects.objects).isRequired,
  checked: PropTypes.bool,
  noCard: PropTypes.bool,
  objectNoCard: PropTypes.bool,
  values: PropTypes.objectOf(
    PropTypes.shape({
      density: PropTypes.exact({
        disabled: PropTypes.bool,
        value: PropTypes.number,
      }),
      altitude: PropTypes.exact({
        disabled: PropTypes.bool,
        min: PropTypes.number,
        max: PropTypes.number,
      }),
      angle: PropTypes.exact({
        disabled: PropTypes.bool,
        min: PropTypes.number,
        max: PropTypes.number,
      }),
      humidity: PropTypes.exact({
        disabled: PropTypes.bool,
        min: PropTypes.number,
        max: PropTypes.number,
      }),
    }),
  ),
  optionIcon: PropTypes.element,
  onChange: PropTypes.func,
};
