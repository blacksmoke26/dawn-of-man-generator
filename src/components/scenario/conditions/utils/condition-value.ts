/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-03
 * @version 2.5.0
 */

// utils
import {
  DISTANCE_MAX,
  DISTANCE_MIN,
  ENTITY_COUNT_MAX,
  ENTITY_COUNT_MIN,
  ERAS,
  GAME_MODES,
  START_MODES,
} from '~/utils/condition';
import {
  CHALLENGES_MAX,
  CHALLENGES_MIN, GAME_SPEED_MAX, GAME_SPEED_MIN, KNOWLEDGE_MAX, KNOWLEDGE_MIN,
  MILESTONES_MAX,
  MILESTONES_MIN,
  PRESTIGE_MAX,
  PRESTIGE_MIN,
} from '~/utils/scenario/defaults';
import {ANGLE_MAX, ANGLE_MIN} from '~/utils/defaults';

// types
import {MapDocument} from '~/types/json.types';
import {snakeCase} from 'change-case';

export type ValueType =
  | 'Population' // int
  | 'DomesticAnimalCount' // int
  | 'CompletedMilestones' // int
  | 'CompletedHardcoreMilestones' // int
  | 'CompletedChallenges' // int
  | 'CompletedHardcoreChallenges' // int
  | 'Prestige' // int
  | 'ResidentCount' // int
  | 'KnowledgeAmount' // int
  | 'GameSpeed' // int
  | 'CameraDistanceMoved' // int
  | 'CameraAngleRotated' // int
  | 'CurrentScenario' // snake_text
  | 'CurrentEnvironment' // snake_text
  | 'CurrentEra' // list
  | 'CurrentSuperEra' // list
  | 'CurrentGameState' // list
  | 'CurrentGameMode' // list
  | 'CurrentStartMode'; // list

export const valueTypes: MapDocument<ValueType, string> = {
  Population: 'int',
  DomesticAnimalCount: 'int',
  CompletedMilestones: 'int',
  CompletedHardcoreMilestones: 'int',
  CompletedChallenges: 'int',
  CompletedHardcoreChallenges: 'int',
  Prestige: 'int',
  ResidentCount: 'int',
  KnowledgeAmount: 'int',
  GameSpeed: 'int',
  CameraDistanceMoved: 'int',
  CameraAngleRotated: 'int',

  CurrentScenario: 'snake',
  CurrentEnvironment: 'snake',

  CurrentEra: 'list',
  CurrentSuperEra: 'list',
  CurrentGameState: 'snake',
  CurrentGameMode: 'list',
  CurrentStartMode: 'list',
};

export const getItemsByType = (type: ValueType): string[] => {
  switch (type) {
    case 'CurrentEra':
    case 'CurrentSuperEra':
      return ERAS;
    case 'CurrentGameMode':
      return GAME_MODES;
    case 'CurrentStartMode':
      return START_MODES;
    default:
      return [];
  }
};
export const getMinMaxByType = (type: ValueType): { min: number; max: number } => {
  switch (type) {
    case 'Population':
    case 'ResidentCount':
    case 'DomesticAnimalCount':
      return {min: ENTITY_COUNT_MIN, max: ENTITY_COUNT_MAX};
    case 'CompletedMilestones':
    case 'CompletedHardcoreMilestones':
      return {min: MILESTONES_MIN, max: MILESTONES_MAX};
    case 'CompletedChallenges':
    case 'CompletedHardcoreChallenges':
      return {min: CHALLENGES_MIN, max: CHALLENGES_MAX};
    case 'Prestige':
      return {min: PRESTIGE_MIN, max: PRESTIGE_MAX};
    case 'GameSpeed':
      return {min: GAME_SPEED_MIN, max: GAME_SPEED_MAX};
    case 'CameraDistanceMoved':
      return {min: DISTANCE_MIN, max: DISTANCE_MAX};
    case 'CameraAngleRotated':
      return {min: ANGLE_MIN, max: ANGLE_MAX};
    case 'KnowledgeAmount':
      return {min: KNOWLEDGE_MIN, max: KNOWLEDGE_MAX};
    default:
      return {min: 1, max: 1000};
  }
};

export const normalizeMinMax = (name: ValueType, value: number): number => {
  const {min, max} = getMinMaxByType(name);

  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
};

export const transformValue = (name: ValueType, type: string, value: any): any => {
  switch (type) {
    case 'snake':
      return snakeCase(String(value || ''));
    case 'int':
      return normalizeMinMax(name, Number(+value || 0) || 0);
    case 'list': {
      const items = getItemsByType(name);
      const propValue = String(value || '');
      return !items.includes(propValue) ? items[0] : propValue;
    }
    default:
      return value;
  }
};
