/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import merge from 'deepmerge';

// types
import {Col, Form, Row} from 'react-bootstrap';
import {nanoid} from 'nanoid';
import Select, {Option} from '~/components/ui/Select';
import {Milestone as MilestoneType} from '~/types/milestone.types';
import {CONDITIONS_OPTIONS, LOGICAL_CONDITION} from '~/utils/condition';
import {toString} from '~/helpers/string';

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
import ConditionLogical from '~/components/scenario/conditions/ConditionLogical';

export interface ChangedValues {
}

export interface Props {
  id?: string;
  conditions?: MilestoneType['conditions'];

  onChange?(template: string, values: ChangedValues): void,
}

interface ConditionRegistry {
  [uniqueName: string]: any;

  enabled: boolean,
  disabledCheckbox: boolean,
  expanded: boolean,
  template: string,
  internalName: string;
  subConditions?: ConditionsState;
}

interface ConditionsState {
  [uniqueName: string]: ConditionRegistry;
}

const componentsMap: Record<string, React.FC<any>> = {
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

const createConditionComponent = (condition: ConditionRegistry): React.FC<any> => {
  let name = condition.internalName as string;
  if (LOGICAL_CONDITION.includes(name)) {
    name = 'ConditionLogical';
  }
  if (!(name in componentsMap)) {
    throw new Error(`Unknown condition component: ${name}`);
  }

  return componentsMap[name];
};

const Milestone = (props: Props) => {
  const newProps = merge<Props>({
    id: '',
    conditions: {},
    onChange: () => {
    },
  }, props);

  const [milestoneId, setMilestoneId] = React.useState<string>(toString(newProps.id));
  const [conditions, setConditions] = React.useState<ConditionsState>({});
  const [disabled, setDisabled] = React.useState<boolean>(true);

  const updateSubCondition = (id: string, values: Record<string, any> = {}): void => {
    setConditions((current) => {
      /*current[id] = merge(current?.[id] || {}, values as Partial<ConditionsState>);
      return current;*/
      return {...current, [id]: merge(current?.[id] || {}, values as Partial<ConditionsState>)};
    });
  };

  const toTemplateText = (): string => {
    /*return !attributes.enabled || !String(attributes?.workAreaId || '')?.trim()
      ? ''
      : (
        `<milestone type="${CONDITION_NAME}"`
        + ` work_area_id="${attributes?.workAreaId}"`
        + ` max_workers="${attributes.maxWorkers}"/>`
      );*/
    return '';
  };

  // Reflect state changes
  React.useEffect(() => {
    typeof newProps.onChange === 'function' && newProps.onChange(toTemplateText(), conditions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditions]);

  // Reflect prop changes
  React.useEffect(() => {
    //props?.id && setDisabled(props.);
    props?.id && setMilestoneId(props?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  /** Generate selection based nodes */
  const renderConditions = (): React.ReactElement[] => {
    const nodes: React.ReactElement[] = [];

    const totalCount = Object.keys(conditions).length;
    let index = 0;

    for (const [_id, condition] of Object.entries(conditions)) {
      console.log('condition:', condition);
      const ConditionComponent = createConditionComponent(condition);
      const componentProps = {...condition} as Record<string, any>;

      delete componentProps?.internalName;

      nodes.push(
        <React.Fragment key={_id}>
          <div className="ml-3 pl-3" style={{borderLeft: '2px solid #616978'}}>
            <ConditionComponent
              {...componentProps}
              disabledCheckbox={disabled}
              removeIcon={true}
              /*onRemoveClick={() => removeSubCondition(_id)}*/
              onChange={(template: string, values: Record<string, any>) => {
                console.log('values', values)
                //updateSubCondition(_id, {...values, template});
                //triggerHandler();
              }}/>
          </div>
          {index < totalCount - 1 && <hr className="mt-2 mb-2"/>}
        </React.Fragment>
      );
      index++;
    }

    return nodes;
  }

  return (
    <div className="mt-0 checkbox-align ">
      <Form.Check
        className="pull-right"
        type="switch"
        id={`allow_milestone-switch-${nanoid(5)}`}
        label="Allow milestone for a current scenerio"
        checked={!disabled}
        onChange={e => setDisabled(!e.target.checked)}
      />
      <Row className="mb-1 mt-2">
        <Col xs="2">
          <div className="position-relative pl-3" style={{top: 7}}>ID</div>
        </Col>
        <Col xs="3">
          <Form.Control
            type="text"
            size="sm"
            disabled={disabled}
            className="pull-right"
            aria-disabled={disabled}
            id={`condition-${nanoid(5)}`}
            placeholder="e.g., first_time"
            value={milestoneId}
            onChange={e => setMilestoneId(e.target.value.replace(/['"]+/ig, ``))}
            onKeyUp={e => {
              // @ts-ignore
              e.target.value = e.target.value.replace(/['"]+/ig, ``).replace(/\t+/ig, `_`).toLowerCase();
            }}
          />
        </Col>
      </Row>
      <div className="mt-2 mb-3">
        <Select
          isDisabled={disabled}
          menuPortalTarget={document.body}
          options={CONDITIONS_OPTIONS}
          value={null}
          placeholder="Add milestone condition..."
          onChange={(option: Option | any, {action}): void => {
            if (action === 'select-option' && option) {
              const values: ConditionRegistry = {
                internalName: option.value as string,
                disabledCheckbox: false,
                enabled: true,
                expanded: true,
                template: '',
              };

              if (LOGICAL_CONDITION.includes(option.value)) {
                values['subConditions'] = {};
                values['operator'] = option.value;
              }
              updateSubCondition(nanoid(10).toLowerCase(), values);
            }
          }}
        />
      </div>
      {renderConditions()}
    </div>
  );
};

// Properties validation
Milestone.propTypes = {
  id: PropTypes.string,
};

export default Milestone;
