/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-04
 * @version 2.5.0
 */

// utils
import {isObject} from '~/helpers/object';
import {EVENT_FLAGS} from '~/utils/event';
import {isString, toString} from '~/helpers/string';

// parsers
import {parseAction} from '../actions/utils/action';
import {parseCondition} from '~/data/scenario/parser/modules/condition/utils/condition';

// types
import type {Json} from '~/types/json.types';
import type {AnyAction} from '~/types/action.types';
import type {scenario} from '~/data/scenario/parser/types';
import {snakeCase} from 'change-case';

interface NormalizeEvent {
  id: string;
  flags: string[];
  condition: Json;
  actions: Json[];
}

const isRawEvent = (event: Json): boolean => {
  if (!isObject(event)
    || !isObject(event?.condition)
    || !event?.actions?.action) {
    return false;
  }

  return [].concat(event?.actions.action).length > 0;
};

const normalizeEvent = (event: Json): NormalizeEvent => {
  const rawActions = [].concat(event?.actions?.action);
  const flags: string[] = isString(event?.flags) ? event.flags.split(',').map((v: string) => v.trim()) : [];

  const newEvent: NormalizeEvent = {
    id: '',
    condition: event?.condition,
    flags: [],
    actions: [],
  };

  isString(event?.id) && (newEvent.id = snakeCase(toString(event?.id).trim()))

  for (const action of rawActions) {
    if (!isObject(action)) {
      continue;
    }

    newEvent.actions.push(action);
  }

  newEvent.flags = flags.filter(flag => (EVENT_FLAGS as unknown as string[]).includes(flag));

  return newEvent;
};

export const filterRawEvents = (events: Json[]) => {
  return events
    .filter(isRawEvent).map(normalizeEvent)
    .filter(evt => !!evt.actions.length);
};

export const parseEvent = (event: Json): scenario.Event | null => {
  const condition = parseCondition(event.condition);

  if (condition === null) {
    return null;
  }

  const newEvent = {
    id: toString(event?.id).trim(),
    flags: event.flags,
    condition,
    actions: [] as AnyAction[],
  } as scenario.Event;

  !newEvent?.id?.length && delete newEvent.id;
  !event.flags.length && delete newEvent.flags;

  for (const action of event.actions) {
    const parsed = parseAction(action);

    if (parsed !== null) {
      newEvent.actions.push(parsed as AnyAction);
    }
  }

  return !newEvent.actions.length ? null : newEvent;
};
