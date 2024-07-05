/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

// utils
import {EVENT_FLAGS} from '~/utils/event';

// types
import type {AnyAction} from '~/types/action.types';
import type {AnyCondition} from '~/types/condition.types';

// public types
export type EventFlagType = typeof EVENT_FLAGS[number];

export interface Event {
  id?: string;
  flags?: EventFlagType[];
  condition: AnyCondition;
  actions: AnyAction[];
}
