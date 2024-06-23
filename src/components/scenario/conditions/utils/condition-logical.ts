/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';
import {nanoid} from 'nanoid';

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
import {
  GeneralCondition, ConditionProps, LogicalCondition,
} from '~/types/condition.types';

const componentsMap: KVDocument<React.FC<ConditionProps<any>>> = {
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

export interface ChangedValues {
  type: LogicalCondition;
  conditions: PropValues[];
}

export interface ConditionLogicalValues {
  [key: string]: any;

  type?: GeneralCondition;
}


export type PropValues = KVDocument<Required<ConditionLogicalValues, 'type'>>;
export const createConditionComponent = (condition: ConditionLogicalValues): React.FC<ConditionProps<any>> => {
  if (condition?.type === undefined || !(condition.type in componentsMap)) {
    throw new Error(`Unknown condition component: ${condition.internalName}`);
  }

  return componentsMap[condition.type as GeneralCondition];
};

export const arrayValuesToAttributes = (values: ConditionLogicalValues[]): PropValues => {
  if (!Array.isArray(values) || !values.length) {
    return {};
  }

  const registry: KVDocument = {};

  for (const item of values) {
    if (item?.type) {
      const key: string = `condition_${nanoid(10).toLowerCase()}`;
      registry[key] = {...item};
    }
  }
  return registry as PropValues;
};

export const subConditionDefaultProps = {
  enabled: true,
  disabledCheckbox: false,
  removeIcon: false,
  showCheckbox: true,
  expanded: true,
  initialValues: {},
  values: {},
  onChange: () => {
  },
  onTemplate: () => {
  },
  onValuesChange: () => {
  },
  onRemoveClick: () => {
  },
};
