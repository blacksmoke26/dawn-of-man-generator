/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-12
 */

import React from 'react';
import merge from 'deepmerge';

// utils
import {onlyKeys} from '~/helpers/object';
import {LOGICAL_CONDITION} from '~/utils/condition';

// types
import type {$Keys, Required} from 'utility-types';

// elemental components
import ConditionLogical, {ConditionList} from '~/components/scenario/conditions/ConditionLogical';
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

// noinspection ES6ConvertRequireIntoImport
const isEqual = require('is-equal');

export interface ConditionRegistry {
  [uniqueName: string]: any;

  enabled: boolean,
  disabledCheckbox: boolean,
  expanded: boolean,
  template: string,
  internalName: string;
  subConditions?: ConditionList;
}

export interface ConditionsState {
  [uniqueName: string]: ConditionRegistry;
}

export interface Props {
  id: string;
  internalName: string;
  values: ConditionRegistry;
  disabledCheckbox?: boolean,
  expanded?: boolean,
  template?: string,

  onChange?(template: string, values: Record<string, any>): void,

  onRemoveClick?(): void,
}

export const componentsMap: Record<string, React.FC<any>> = {
  ConditionLogical,
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

const excludedPropKeys: $Keys<ConditionRegistry>[] = [
  'template', 'internalName',
];

export const createConditionComponent = (name: string): React.FC<any> => {
  if (LOGICAL_CONDITION.includes(name)) {
    name = 'ConditionLogical';
  }
  if (!(name in componentsMap)) {
    throw new Error(`Unknown condition component: ${name}`);
  }

  return componentsMap[name];
};

export const toConditionProps = (conditions: ConditionRegistry): Record<string, any> => {
  return onlyKeys(
    conditions, excludedPropKeys, true,
  );
};

/** Condition functional component */
const Condition = (props: Props) => {
  const newProps = merge<Required<Props>>({
    id: '',
    internalName: '',
    onChange() {
    },
    onRemoveClick() {
    },
  }, props);

  const [expanded, setExpanded] = React.useState<boolean>(newProps?.values?.expanded ?? false);
  const [values, setValues] = React.useState<ConditionRegistry>(
    toConditionProps(newProps.values) as ConditionRegistry,
  );

  React.useEffect(() => {
    const newValues = toConditionProps(props.values);
    if (props?.values !== undefined && !isEqual(values, newValues, true)) {
      setValues(newValues as ConditionRegistry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const ConditionComponent = createConditionComponent(props.internalName);
  const componentProps = onlyKeys<ConditionRegistry>(
    values, excludedPropKeys, true,
  ) as Record<string, any>;

  return (
    <ConditionComponent
      {...componentProps}
      expanded={expanded}
      removeIcon={true}
      showCheckbox={false}

      onRemoveClick={() => {
        typeof newProps.onRemoveClick === 'function' && newProps.onRemoveClick();
      }}
      onChange={(template: string, values: Record<string, any>) => {
        setExpanded(values.expanded);
        typeof newProps.onChange === 'function' && newProps.onChange(template, {
          type: props.internalName,
          ...onlyKeys(values, ['disabledCheckbox', 'enabled'], true),
        });
      }}/>
  );
};

export default Condition;
