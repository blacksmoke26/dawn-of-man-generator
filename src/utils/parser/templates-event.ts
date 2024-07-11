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

export const toEventTemplate = (event: EventType, disabled: boolean = false): string => {
  if (disabled || !Object.keys(event?.condition || {}).length || !event?.actions.length) {
    return '';
  }

  const eventProps: string[] = [];

  event?.id?.length
  && eventProps.push(`id="${event?.id}"`);

  event?.flags?.length
  && eventProps.push(`flags="${event?.flags?.join(',')}"`);

  const conditionTemplate = toAnyConditionTemplate(event.condition);
  const actionsTemplate = toActionsTemplate(event.actions);

  return renderTemplate(
    'event', null, eventProps,
    conditionTemplate + actionsTemplate,
  );
};

export const toEventsTemplate = (events: (string | EventType)[], disabled: boolean = false): string => {
  if (disabled || !events?.length) return '';

  const templates: string[] = [];

  for (const event of events) {
    if ('string' === typeof event) {
      event.trim() && templates.push(event);
      continue;
    }

    const template = toEventTemplate(event);
    template.trim() && templates.push(template);
  }

  return templates.length ? renderTemplate('events', null, [], templates.join('')) : '';
};
