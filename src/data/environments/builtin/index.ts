/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import eurasia, {info as info1} from './eurasia';
import eurasia_conflict, {info as info2} from './eurasia_conflict';
import eurasia_flatlands, {info as info3} from './eurasia_flatlands';
import eurasia_glacial, {info as info4} from './eurasia_glacial';
import eurasia_north, {info as info5} from './eurasia_north';
import eurasia_warm, {info as info6} from './eurasia_warm';
import flat, {info as info7} from './flat';

// types
import {environment} from '~/data/environments/parser/types';

/** Builtin environments labels */
export const labels: object[] = [
  info1, info2, info3,
  info4, info5, info6,
  info7,
];

export type BuiltinEnvironmentName =
  | 'eurasia'
  | 'eurasia_conflict'
  | 'eurasia_flatlands'
  | 'eurasia_glacial'
  | 'eurasia_north'
  | 'eurasia_warm'
  | 'flat';

/** Builtin environments */
export const environments: Record<BuiltinEnvironmentName, (() => { environment: environment.Environment })> = {
  eurasia,
  eurasia_conflict,
  eurasia_flatlands,
  eurasia_glacial,
  eurasia_north,
  eurasia_warm,
  flat,
};
