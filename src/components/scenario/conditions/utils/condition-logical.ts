/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';

// utils
import {onlyKeys} from '~/helpers/object';

// components
import AnyTasksActive from '../AnyTasksActive';
import AnyWorkAreasActive from '../AnyWorkAreasActive';
import EntityCountComparison from '../EntityCountComparison';
import EntityCountReached from '../EntityCountReached';
import EntityNearMarker from '../EntityNearMarker';
import EraUnlocked from '../EraUnlocked';
import InitGame from '../InitGame';
import IsAlive from '../IsAlive';
import IsGameInteractionPending from '../IsGameInteractionPending';
import NewGame from '../NewGame';
import ScenarioCompleted from '../ScenarioCompleted';
import TechUnlocked from '../TechUnlocked';
import TimeElapsed from '../TimeElapsed';
import ValueEquals from '../ValueEquals';
import ValueReached from '../ValueReached';

// types
import type {Required} from 'utility-types';
import type {KVDocument} from '~/types/json.types';
import type {
  GeneralCondition,
  ConditionType as ConditionTypeBase,
} from '~/types/condition.types';

const componentsMap = {
  AnyTasksActive,
  AnyWorkAreasActive,
  EntityCountComparison,
  EntityCountReached,
  EntityNearMarker,
  EraUnlocked,
  InitGame,
  IsAlive,
  IsGameInteractionPending,
  NewGame,
  ScenarioCompleted,
  TechUnlocked,
  TimeElapsed,
  ValueEquals,
  ValueReached,
};

export type ConditionType = Required<ConditionTypeBase, 'internalName'> & {
  enabled?: boolean,
  expanded?: boolean,
  template?: string,
};

export type ConditionList = Record<string, ConditionType>;

export type SubConditionsValues = KVDocument<KVDocument>;

export interface ChangedValues {
  subConditions: SubConditionsValues;
}
export const createConditionComponent = (condition: ConditionType): React.FC<any> => {
  if (!(condition.internalName in componentsMap)) {
    throw new Error(`Unknown condition component: ${condition.internalName}`);
  }

  return componentsMap[condition.internalName as GeneralCondition];
};

export const subConditionToValues = (conditions: ConditionList): ChangedValues => {
  const subConditions: SubConditionsValues = {};
  let index = 0;

  for (const [, condition] of Object.entries(conditions)) {
    if (!condition.enabled) {
      continue;
    }
    index++;
    const attributes = onlyKeys(condition, [
      'internalName', 'expanded', 'disabledCheckbox', 'enabled', 'template',
    ], true) as KVDocument;

    subConditions[`condition_${index}`] = {type: condition.internalName, ...attributes};
  }

  return {subConditions};
};
