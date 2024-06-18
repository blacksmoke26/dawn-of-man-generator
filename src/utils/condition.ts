/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {capitalCase} from 'change-case';

// types
import {DeepPartial} from 'utility-types';
import {ConditionDefaultParams,} from '~/types/condition.types';

export const ENTITY_COUNT_MIN: number = 0;

export const ENTITY_COUNT_DEFAULT: number = 150;

export const ENTITY_COUNT_MAX: number = 500;

export const PERFORMERS_MIN: number = 0;

export const PERFORMERS_MAX: number = 250;

export const WORKERS_MIN: number = 1;

export const WORKERS_MAX: number = 250;

export const DISTANCE_MIN: number = 1;

export const DISTANCE_MAX: number = 360;

export const LOGICAL_CONDITION: string[] = [
  'And',
  'Not',
  'Or',
];

export const COMPARISONS: string[] = [
  'Less',
  'LessOrEquals',
  'Equals',
  'GreaterOrEquals',
  'Greater',
];

export const ERAS: string[] = [
  'Paleolithic',
  'Mesolithic',
  'Neolithic',
  'CopperAge',
  'BronzeAge',
  'IronAge',
];

export const GENERAL_CONDITIONS: string[] = [
  'AnyTasksActive',
  'AnyWorkAreasActive',
  'EntityCountComparison',
  'EntityCountReached',
  'EntityNearMarker',
  'EraUnlocked',
  'InitGame',
  'IsAlive',
  'IsGameInteractionPending',
  'NewGame',
  'ScenarioCompleted',
  'TechUnlocked',
  'TimeElapsed',
  'ValueEquals',
  'ValueReached',
];

export const COUNTERS: string[] = [
  'All',
  'PlayerEntities',
  'KilledRaiders',
  'HuntedAnimals',
  'ProducedResources',
  'BuiltStructures',
  'AliveAnimals',
  'DeadAnimals',
  'DeadResidents',
  'PredictedAmount',
  'LockedTechs',
  'ContinuousAmount',
];

export const START_MODES: string[] = [
  'Settled',
  'Nomad',
];

export const GAME_MODES: string[] = [
  'Normal',
  'Hardcore',
];

export const TIME_ELAPSED: string[] = [
  'GameTime',
  'RealTime',
  'EraRealTime',
  'IdleTime',
  'MessageTime',
  'EventTriggeredTime',
  'GoalsCompletedTime',
  'PrimalVisionTime',
];

export const VALUE_EQUALS: string[] = [
  'Population',
  'DomesticAnimalCount',
  'CompletedMilestones',
  'CompletedHardcoreMilestones',
  'CompletedChallenges',
  'CompletedHardcoreChallenges',
  'Prestige',
  'ResidentCount',
  'KnowledgeAmount',
  'GameSpeed',
  'CurrentScenario',
  'CurrentEnvironment',
  'CurrentEra',
  'CurrentSuperEra',
  'CurrentGameState',
  'CurrentGameMode',
  'CurrentStartMode',
];

export const VALUE_REACHED: string[] = [
  'Population',
  'DomesticAnimalCount',
  'CompletedMilestones',
  'CompletedHardcoreMilestones',
  'CompletedChallenges',
  'CompletedHardcoreChallenges',
  'Prestige',
  'ResidentCount',
  'KnowledgeAmount',
  'GameSpeed',
  'CameraDistanceMoved',
  'CameraAngleRotated',
];

export const INTERACTIONS: string[] = [
  'None',
  'CustomizePanels',
];

/** List of all conditions */
export const CONDITIONS_ALL = ([] as string[]).concat(LOGICAL_CONDITION, GENERAL_CONDITIONS);

export const CONDITIONS_OPTIONS = [
  {label: 'Logical', options: LOGICAL_CONDITION.map(value => ({label: capitalCase(value), value, type: 'logical'}))},
  {label: 'General', options: GENERAL_CONDITIONS.map(value => ({label: capitalCase(value), value, type: 'general'}))},
];

export const defaultsParams: DeepPartial<ConditionDefaultParams> = {
  anyTasksActive: {
    taskType: '',
    minPerformers: PERFORMERS_MIN,
  },
  anyWorkAreasActive: {
    workAreaId: '',
    maxWorkers: 1
  },
  entityCountComparison: {
    counter: 'All',
    entityType: 'primitive_human',
    value: ENTITY_COUNT_DEFAULT,
    comparison: 'Equals',
  },
  entityCountReached: {
    counter: 'All',
    entityType: 'primitive_human',
    value: ENTITY_COUNT_DEFAULT,
  },
  entityNearMarker: {
    entityType: 'primitive_human',
    distance: 20,
  },
  eraUnlocked: {
    era: 'Paleolithic',
  },
  initGame: {},
  isAlive: {
    name: '',
  },
  isGameInteractionPending: {
    value: 'None',
  },
  newGame: {
    startMode: 'Nomad',
  },
  scenarioCompleted: {
    id: '',
    gameMode: 'Normal',
  },
  techUnlocked: {
    tech: 'archery',
    techs: [],
  },
  timeElapsed: {
    timer: 'RealTime',
    value: 0,
  },
  valueEquals: {
    id: 'Population',
    value: '',
  },
  valueReached: {
    id: 'Population',
    value: ENTITY_COUNT_DEFAULT,
  },
};
