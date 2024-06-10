/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Col, Form, Row} from 'react-bootstrap';
import {camelCase, capitalCase} from 'change-case';

// types
import type {Required} from 'utility-types';
import type {
  SubConditions,
  LogicalCondition,
  GeneralConditionKey,
  GeneralCondition,
  ConditionType as ConditionTypeBase,
} from '~/types/condition.types';

// conditions sub-components
import AnyTasksActive from './AnyTasksActive';
import AnyWorkAreasActive from './AnyWorkAreasActive';
import EntityCountComparison from './EntityCountComparison';
import EntityCountReached from './EntityCountReached';
import EntityNearMarker from './EntityNearMarker';
import EraUnlocked from './EraUnlocked';
import InitGame from './InitGame';
import IsAlive from './IsAlive';
import IsGameInteractionPending from './IsGameInteractionPending';
import NewGame from './NewGame';
import ScenarioCompleted from './ScenarioCompleted';
import TechUnlocked from './TechUnlocked';
import TimeElapsed from './TimeElapsed';
import ValueEquals from './ValueEquals';
import ValueReached from './ValueReached';

// icons
import {
  IconConditionOr,
  IconConditionAnd,
  IconConditionNot,
  IconCondition,
  COLOR_DISABLED, COLOR_REDDISH
} from '~/components/icons/app';

// elemental components
import Select, {Option} from '~/components/ui/Select';

// utils
import {GENERAL_CONDITIONS, LOGICAL_CONDITION, defaultsParams} from '~/utils/condition';

/** ConditionNot `props` type */
interface Props {
  enabled?: boolean,
  operator: LogicalCondition;
  subConditions?: SubConditions;

  onChange(template: string, conditions: ConditionList): void,
}

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

const conditionIcon = (operator: LogicalCondition) => {
  return operator === 'And'
    ? <IconConditionAnd/>
    : (operator === 'Not'
      ? <IconConditionNot/>
      : <IconConditionOr/>);
};

export type ConditionType = Required<ConditionTypeBase, 'internalName'> & {
  enabled?: boolean,
  template?: string,
};

export type ConditionList = Record<string, ConditionType>;

const createConditionComponent = (condition: ConditionType): React.FC<any> => {
  if (!(condition.internalName in componentsMap)) {
    throw new Error(`Unknown condition component: ${condition.internalName}`);
  }

  return componentsMap[condition.internalName];
};

/** ConditionLogical functional component */
const ConditionLogical = (props: Props) => {
  const newProps = merge({
    enabled: true,
    subConditions: [],
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(newProps.enabled as boolean);
  const [subConditions, setSubConditions] = React.useState<ConditionList>({});

  const triggerHandler = () => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), subConditions);
  };

  /** Generate xml code */
  const toTemplateText = (): string => {
    if (!enabled) {
      return '';
    }

    const templates = Object.values(subConditions)
      .map(({template}) => String(template || '').trim())
      .join(``);

    return `<condition><sub_conditions>${templates}</sub_conditions></condition>`;
  };

  const updateSubCondition = (id: string, values: Partial<ConditionType> = {}): void => {
    setSubConditions(current => {
      current[id] = merge(current[id], values);
      return current;
    });
  };

  const subConditionsList = Object.entries(subConditions);
  const totalCount = subConditionsList.length;

  return (
    <div className={cn({'text-muted': !enabled})}>
      <div style={{background: '#333', padding: '11px 11px 2px 11px', borderRadius: 2}}>
        <Row>
          <Col col="3" className="checkbox-align">
            <Form.Check
              type="switch"
              id={`locations_override-switch-${nanoid(5)}`}
              label={<span className="position-relative" style={{top: -1}}>
            <span className={cn('text-size-sm mr-1', {'text-muted': !enabled})}>
              <IconCondition width="17" height="17"
                             color={!enabled ? COLOR_DISABLED : COLOR_REDDISH}/>
              {' '} <strong>Condition</strong>
            </span>
            </span>}
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
            />
          </Col>
          <Col col="3" className="text-right" style={{top: -4}}>
            <strong style={{color: COLOR_REDDISH}}
                    className={cn('text-size-sm', {'text-muted': !enabled})}>
              {conditionIcon(newProps.operator)}
              {' '}
              <span className="position-relative" style={{top: '0.01rem'}}>
                {newProps.operator?.toUpperCase()}
              </span>
            </strong>
          </Col>
        </Row>
      </div>
      <div className="mt-2 mb-2 pl-3">
        <div className="d-inline-block mr-2">
          Pick condition:
        </div>
        <div className="d-inline-block mr-2" style={{width: '40%'}}>
          <Select
            isDisabled={!enabled}
            menuPortalTarget={document.body}
            value={null}
            formatOptionLabel={(option: Option | any) => (
              <span>
                  <IconCondition width="17" height="17" color={COLOR_REDDISH}/>
                {' '} {option?.label}</span>
            )}
            options={GENERAL_CONDITIONS.map(value => ({label: capitalCase(value), value}))}
            placeholder="Insert condition..."
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                const defaultConfigKey = camelCase(option?.value) as GeneralConditionKey;
                const newCondition = merge<ConditionType>({
                    internalName: option.value as GeneralCondition,
                    enabled: true,
                    template: '',
                  },
                  defaultsParams?.[defaultConfigKey] || {}
                );
                setSubConditions(current => ({...current, [nanoid(10)]: newCondition}));
              }
            }}
          />
        </div>
        <div className="clearfix"></div>
      </div>
      <div className="mt-3">
        {subConditionsList.map(([_id, condition], index) => {
          const ConditionComponent = createConditionComponent(condition);
          const componentProps = {...condition} as Partial<ConditionType>;
          delete componentProps?.internalName;

          return (
            <React.Fragment key={_id}>
              <div className="ml-3 pl-3" style={{borderLeft: '2px solid #616978'}}>
                <ConditionComponent
                  {...componentProps}
                  disabledCheckbox={!enabled}
                  onChange={(template: string, values: Record<string, any>) => {
                    updateSubCondition(_id, {...values, template});
                    triggerHandler();
                  }}/>
              </div>
              {index < totalCount-1 && <hr className="mt-2 mb-2"/>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Properties validation
ConditionLogical.propTypes = {
  enabled: PropTypes.bool,
  operator: PropTypes.oneOf(LOGICAL_CONDITION),
  subConditions: PropTypes.arrayOf(
    PropTypes.shape({
      internalName: PropTypes.oneOf(GENERAL_CONDITIONS).isRequired
    })
  ),
  onChange: PropTypes.func,
};

export default ConditionLogical;
