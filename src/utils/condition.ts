/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {DeepPartial} from 'utility-types';
import {ConditionDefaultParams,} from '~/types/condition.types';

export const ENTITY_COUNT_MIN: number = 0;

export const ENTITY_COUNT_MAX: number = 500;

export const PERFORMERS_MIN: number = 0;

export const PERFORMERS_MAX: number = 250;

export const defaultsParams: DeepPartial<ConditionDefaultParams> = {
  anyTasksActive: {
    minPerformers: PERFORMERS_MIN,
  },
  anyWorkAreasActive: {
    maxWorkers: 1
  },
  entityCountComparison: {
    counter: 'All',
    value: ENTITY_COUNT_MAX,
  },
  entityCountReached: {
    value: ENTITY_COUNT_MAX,
  },
  entityNearMarker: {
    distance: 20,
  },
  eraUnlocked: {},
  initGame: {},
  isAlive: {},
  isGameInteractionPending: {},
  newGame: {},
  scenarioCompleted: {
    gameMode: 'Normal',
  },
  techUnlocked: {},
  timeElapsed: {
    timer: 'RealTime',
    value: 0,
  },
  valueEquals: {
  },
  valueReached: {
    value: ENTITY_COUNT_MAX,
  },
};
