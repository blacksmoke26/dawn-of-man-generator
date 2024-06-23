/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2.3
 */

import React from 'react';

// conditions components
import ConditionLogical from '~/components/scenario/conditions/ConditionLogical';
import AnyTasksActive from '~/components/scenario/conditions/AnyTasksActive';
import AnyWorkAreasActive from '~/components/scenario/conditions/AnyWorkAreasActive';
import EntityCountComparison from '~/components/scenario/conditions/EntityCountComparison';
import EntityCountReached from '~/components/scenario/conditions/EntityCountReached';
import EntityNearMarker from '~/components/scenario/conditions/EntityNearMarker';
import EraUnlocked from '~/components/scenario/conditions/EraUnlocked';
import InitGame from '~/components/scenario/conditions/InitGame';
import IsAlive from '~/components/scenario/conditions/IsAlive';
import IsGameInteractionPending from '~/components/scenario/conditions/IsGameInteractionPending';
import NewGame from '~/components/scenario/conditions/NewGame';
import ScenarioCompleted from '~/components/scenario/conditions/ScenarioCompleted';
import TechUnlocked from '~/components/scenario/conditions/TechUnlocked';
import TimeElapsed from '~/components/scenario/conditions/TimeElapsed';
import ValueEquals from '~/components/scenario/conditions/ValueEquals';
import ValueReached from '~/components/scenario/conditions/ValueReached';

// types
import type {ConditionName, ConditionProps} from '~/types/condition.types';

export const componentsMap: Record<string, React.FC<any>> = {
  And: ConditionLogical,
  Or: ConditionLogical,
  Not: ConditionLogical,
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

export const createConditionComponent = <T = any>(type: ConditionName): React.FC<ConditionProps<T>> => {
  if (!(type in componentsMap)) {
    throw new Error(`Unknown condition component: ${type}`);
  }

  return componentsMap[type];
};

