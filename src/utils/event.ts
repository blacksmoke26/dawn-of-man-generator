/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */
import {capitalCase} from 'change-case';

export const EVENT_FLAGS = [
  'RequiresPrevious', 'MultipleExecutions', 'ClearUi',
] as const;

export const EVENT_FLAGS_OPTIONS = EVENT_FLAGS.map(value => ({label: capitalCase(value), value}));
