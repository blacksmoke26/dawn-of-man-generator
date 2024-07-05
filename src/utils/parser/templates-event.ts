/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-28
 * @version 2.4
 */

// utils
import {renderTemplate} from '~/utils/template';

// parsers
import {toAnyConditionTemplate} from '~/utils/parser/templates';
import {toActionsTemplate} from '~/utils/parser/templates-action';

// types
import type {Event as EventType} from '~/types/event.types';

export const toEventTemplate = (attributes: EventType, disabled: boolean = false): string => {
  if (disabled || !Object.keys(attributes?.condition || {}).length || !attributes?.actions.length) {
    return '';
  }

  const eventProps: string[] = [];

  attributes?.id?.length
  && eventProps.push(`id="${attributes?.id}"`);

  attributes?.flags?.length
  && eventProps.push(`flags="${attributes?.flags?.join(',')}"`);

  const conditionTemplate = toAnyConditionTemplate(attributes.condition);
  const actionsTemplate = toActionsTemplate(attributes.actions);

  return renderTemplate(
    'event', null, eventProps,
    conditionTemplate + actionsTemplate,
  );
};

export const toEventsTemplate = (templates: string[], disabled: boolean = false): string => {
  return !disabled && templates.length
    ? renderTemplate('events', null, [], templates.join(''))
    : '';
};
