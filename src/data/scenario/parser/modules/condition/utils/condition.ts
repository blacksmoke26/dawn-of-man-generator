/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import op from 'object-path';

// helpers
import {isObject} from '~/helpers/object';

// modules
import {jsonToRedux as and} from '../and';
import {jsonToRedux as not} from '../not';
import {jsonToRedux as or} from '../or';
import {jsonToRedux as anyTasksActive} from '../any-tasks-active';
import {jsonToRedux as anyWorkAreasActive} from '../any-work-areas-active';
import {jsonToRedux as entityCountComparison} from '../entity-count-comparison';
import {jsonToRedux as entityCountReached} from '../entity-count-reached';
import {jsonToRedux as entityNearMarker} from '../entity-near-marker';
import {jsonToRedux as eraUnlocked} from '../era-unlocked';
import {jsonToRedux as initGame} from '../init-game';
import {jsonToRedux as isAlive} from '../is-alive';
import {jsonToRedux as isGameInteractionPending} from '../is-game-interaction-pending';
import {jsonToRedux as newGame} from '../new-game';
import {jsonToRedux as scenarioCompleted} from '../scenario-completed';
import {jsonToRedux as techUnlocked} from '../tech-unlocked';
import {jsonToRedux as timeElapsed} from '../time-elapsed';
import {jsonToRedux as valueEquals} from '../value-equals';
import {jsonToRedux as valueReached} from '../value-reached';

// types
import type {Json, KVDocument} from '~/types/json.types';
import type {LogicalCondition} from '~/types/condition.types';

// noinspection SpellCheckingInspection
const conditionMap: KVDocument<(condition: Json | any) => Json | null> = {
  AnyTasksActive: anyTasksActive,
  AnyWorkAreasActive: anyWorkAreasActive,
  EntityCountComparison: entityCountComparison,
  EntityCountReached: entityCountReached,
  EntityNearMarker: entityNearMarker,
  EraUnlocked: eraUnlocked,
  InitGame: initGame,
  IsAlive: isAlive,
  IsGameInteractionPending: isGameInteractionPending,
  NewGame: newGame,
  ScenarioCompleted: scenarioCompleted,
  TechUnlocked: techUnlocked,
  TimeElapsed: timeElapsed,
  ValueEquals: valueEquals,
  ValueReached: valueReached,
  And: and,
  Not: not,
  Or: or,
};

/**
 * Find sub conditions in conditions array
 * @param operator - The operator
 * @param node - The node
 * @returns The sub conditions or null
 */
export const findSubConditions = (operator: LogicalCondition, node: Json): Json[] | null => {
  const subConditionsNodes = op.get<Json[] | Json | null>(node, 'sub_conditions.condition', null);

  if (subConditionsNodes === null) {
    return null;
  }

  if (Array.isArray(subConditionsNodes)) {
    if (!subConditionsNodes.length) {
      return null;
    }

    return subConditionsNodes as Json[];
  }

  if (!isObject(subConditionsNodes)) {
    return null;
  }

  return !Object.keys(subConditionsNodes).length
    ? null
    : [subConditionsNodes as Json] as Json[];
};

interface ParseSubConditionsReturn {
  type: LogicalCondition;
  conditions: Json[];
}

/**
 * Parse sub conditions nodes and return normalized data
 * @param type - The logical condition type (e.g., And, Or, Not)
 * @param node - The node
 * @returns The normalized data
 */
export const parseSubConditions = (type: LogicalCondition, node: Json): ParseSubConditionsReturn | null => {
  const subConditions = findSubConditions(type, node);

  if (subConditions === null) {
    return null;
  }

  const condition: ParseSubConditionsReturn = {
    type,
    conditions: [],
  };

  for (const subCondition of subConditions) {
    const output = parseGeneralCondition(subCondition);
    output !== null && condition.conditions.push(output);
  }

  return !condition.conditions.length ? null : condition;
};

/**
 * Parse general condition node and return normalized data
 * @param condition - The condition node
 * @returns The normalized data
 */
export const parseGeneralCondition = (condition: Json): Json | null => {
  const type = isObject(condition) ? op.get<string | null>(condition, 'type', null) : null;
  return type === null
  || !(type in conditionMap)
    ? null
    : conditionMap?.[type](condition);
};

/**
 * Parse condition node and return normalized data
 * @param condition - The condition node
 * @returns The normalized data
 */
export const parseCondition = (condition: Json): Json | null => {
  const type = isObject(condition)
    ? op.get<string | null>(condition, 'type', null)
    : null;


  if (type === null) {
    return null;
  }

  return type in conditionMap
    ? conditionMap[type].call(null, condition)
    : null;
};


/**
 * Parse condition node and return normalized data
 * @param node - The milestone node
 * @returns The normalized data
 */
export const parseConditions = (node: Json): Json[] => {
  const parsed = op.get<Json | Json[] | null>(node, 'condition', null);

  if (parsed === null || (!isObject(parsed) && !Array.isArray(parsed))) {
    return [];
  }

  const conditionNodes = (isObject(parsed) ? [parsed] : parsed) as Json[];

  if (!conditionNodes.length) {
    return [];
  }

  const conditions = [] as Json[];

  for (const condition of conditionNodes) {
    const output = parseCondition(condition);

    if (output) {
      conditions.push(output);
    }
  }

  return conditions;
};
