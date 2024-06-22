/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-22
 * @version 2.3.0
 */

import {ObjectTemplateAttributes, ObjectType} from '~/utils/objects';
import {KVDocument} from '~/types/json.types';

//type ObjectPrototypeValues = { DeepOmit<ObjectAttributes, 'disabled'> };

export const toOverridePrototypeTemplate = (
  type: ObjectType, name: string, values: ObjectTemplateAttributes, allowRender: boolean = true,
): string => {
  if (!allowRender || !Object.keys(values).length || !name.trim()) {
    return '';
  }

  const template: string[] = [];

  if (values?.density) {
    template.push(`<density value="${values?.density}" />`);
  }

  if (Array.isArray(values?.altitude) && values?.altitude?.length === 2) {
    const [min, max] = values?.altitude || [];
    template.push(`<min_altitude value="${min}" /><max_altitude value="${max}"/>`);
  }

  if (Array.isArray(values?.angle) && values?.angle?.length === 2) {
    const [min, max] = values?.angle || [];
    template.push(`<min_angle value="${min}" /><max_angle value="${max}"/>`);
  }

  if (Array.isArray(values?.humidity) && values?.humidity?.length === 2) {
    const [min, max] = values?.humidity || [];
    template.push(`<min_humidity value="${min}" /><max_humidity value="${max}"/>`);
  }

  return !template.length ? '' : (
    `<${type}_override_prototype><id value="${name}"/>${template.join('')}</${type}_override_prototype>`
  );
};

export const toOverridePrototypesTemplate = (
  type: ObjectType, values: KVDocument<ObjectTemplateAttributes>, allowRender: boolean = true,
): string => {
  if (!allowRender || !Object.keys(values).length) {
    return '';
  }

  const templates: string[] = [];

  for (const [name, attributes] of Object.entries(values)) {
    const template = toOverridePrototypeTemplate(type, name, attributes).trim();
    template && templates.push(template);
  }

  return !templates.length ? '' : (
    `<${type}_override_prototypes>${templates.join('')}</${type}_override_prototypes>`
  );
};
