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
import xmlFormatter from 'xml-formatter';
import {camelCase, capitalCase} from 'change-case';
import {Button, Col, Form, Row} from 'react-bootstrap';

// types
import type {Required} from 'utility-types';
import type {
  ConditionType as ConditionTypeBase,
  GeneralCondition,
  GeneralConditionKey,
  LogicalCondition,
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
  COLOR_DISABLED,
  COLOR_REDDISH,
  IconChevronDown,
  IconChevronSimpleDown,
  IconChevronSimpleUp,
  IconChevronUp,
  IconClear,
  IconCondition,
  IconConditionAnd,
  IconConditionNot,
  IconConditionOr,
} from '~/components/icons/app';

// elemental components
import Select, {Option} from '~/components/ui/Select';

// utils
import {defaultsParams, GENERAL_CONDITIONS, LOGICAL_CONDITION} from '~/utils/condition';
import {onlyKeys} from '~/helpers/object';

const isEqual = require('is-equal');

type KVDocument = Record<string, any>;
type SubConditionsValues = Record<string, KVDocument>;

export interface ChangedValues {
  subConditions: SubConditionsValues;
}

/** ConditionNot `props` type */
interface Props {
  enabled?: boolean,
  expanded?: boolean,
  operator: LogicalCondition;
  subConditions?: ConditionList;
  removeIcon?: boolean;
  disabledCheckbox?: boolean;
  showCheckbox?: boolean;

  onRemoveClick?(): void,

  onChange(template: string, values: ChangedValues): void,
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

const subConditionToValues = (conditions: ConditionList): ChangedValues => {
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


/** Generate xml code */
const toTemplateText = (conditions: ConditionList): string => {
  const templates = Object.values(conditions)
    .map(({template}) => String(template || '').trim())
    .join(``);

  if ( !templates.trim()) {
    return '';
  }

  return xmlFormatter(
    `<condition><sub_conditions>${templates}</sub_conditions></condition>`,
  );
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
  expanded?: boolean,
  template?: string,
};

export type ConditionList = Record<string, ConditionType>;

const createConditionComponent = (condition: ConditionType): React.FC<any> => {
  if (!(condition.internalName in componentsMap)) {
    throw new Error(`Unknown condition component: ${condition.internalName}`);
  }

  return componentsMap[condition.internalName as GeneralCondition];
};

/** ConditionLogical functional component */
const ConditionLogical = (props: Props) => {
  const newProps = merge({
    enabled: true,
    expanded: true,
    showCheckbox: true,
    subConditions: {},
    removeIcon: false,
    onRemoveClick: () => {
    },
    onChange: () => {
    },
  }, props);

  const [enabled, setEnabled] = React.useState<boolean>(newProps.enabled as boolean);
  const [disabledCheckbox, setDisabledCheckbox] = React.useState<boolean>(newProps.disabledCheckbox as boolean);
  const [expanded, setExpanded] = React.useState<boolean>(newProps.expanded as boolean);
  const [subConditions, setSubConditions] = React.useState<ConditionList>({});

  // Reflect state changes
  React.useEffect(() => {
    const template = enabled ? toTemplateText(subConditions) : '';
    typeof newProps.onChange === 'function' && newProps.onChange(
      template, enabled ? subConditionToValues(subConditions) : {} as ChangedValues,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, subConditions]);

  const updateSubCondition = (id: string, values: Partial<ConditionType> = {}): void => {
    setSubConditions((prevState: ConditionList) => {
      const nextState = {...prevState[id], ...values};
      if (isEqual(prevState[id], nextState)) {
        return prevState as ConditionList;
      }
      return {...prevState, [id]: nextState} as ConditionList;
    });
  };

  const setSubConditionsProperty = <V = any>(prop: string, value: V): void => {
    setSubConditions(current => {
      const _current = {...current};
      Object.keys(_current).forEach(key => {
        const condition: { [p: string]: any } = {...current[key]};
        if (prop in condition) {
          condition[prop as string] = value;
        }
        _current[key] = condition as ConditionType;
      });
      return _current;
    });
  };

  // Reflect prop changes
  React.useEffect(() => {
    props?.enabled !== undefined && setEnabled(Boolean(props?.enabled));
    props?.disabledCheckbox !== undefined && setDisabledCheckbox(Boolean(props?.disabledCheckbox));
    props?.expanded !== undefined && setExpanded(Boolean(props?.expanded));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const subConditionsList = Object.entries(subConditions);
  const totalCount = subConditionsList.length;

  const isDisabled = disabledCheckbox || !enabled || !Object.keys(subConditions).length;

  return (
    <div className={cn({'text-muted': !enabled})}>
      <Row>
        <Col col="6" className="checkbox-align mt-1">
          {!newProps.showCheckbox && (
            <span className={cn('mr-1', {'text-muted': !enabled})}>
              <a href="#disable"
                 className={cn({'text-muted': isDisabled})}
                 onClick={e => {
                   e.preventDefault();
                   if (!isDisabled) {
                     setExpanded(!expanded);
                   }
                 }} style={{
                cursor: !isDisabled ? 'pointer' : 'default',
                color: '#FFF',
              }}>
                <span className="position-relative" style={{top: 0}}>

                <IconCondition width="17" height="17"
                               color={!enabled ? COLOR_DISABLED : COLOR_REDDISH}/>
                  {' '} <strong>Condition:</strong>
                  {' '} SubConditions
              </span>
              </a>
            </span>
          )}
          {newProps.showCheckbox && (<Form.Check
            type="switch"
            id={`locations_override-switch-${nanoid(5)}`}
            label={<span className="position-relative" style={{top: 0}}>
            <span className={cn('mr-1', {'text-muted': !enabled})}>
              <IconCondition width="17" height="17"
                             color={!enabled ? COLOR_DISABLED : COLOR_REDDISH}/>
              {' '} <strong>Condition:</strong>
              {' '} SubConditions
            </span>
            </span>}
            checked={enabled}
            disabled={disabledCheckbox}
            onChange={e => setEnabled(e.target.checked)}
          />)}
        </Col>
        <Col col="6" className="text-right" style={{top: 3}}>
          <div className="d-inline-block">
            <strong style={{color: '#ebeaea'}}
                    className={cn('text-size-sm', {'text-muted': !enabled})}>
              {conditionIcon(newProps.operator)}
              {' '}
              <span className="position-relative" style={{top: '0.01rem'}}>
                {newProps.operator?.toUpperCase()}
              </span>
            </strong>
          </div>
          <div className="d-inline-block ml-2">
            <Button variant="link" className="p-0" style={{top: '-0.080rem'}}
                    disabled={disabledCheckbox}
                    onClick={() => {
                      setExpanded(!expanded);
                    }}>
              {!expanded
                ? <IconChevronSimpleUp width="16" height="16"/>
                : <IconChevronSimpleDown width="16" height="16"/>}
            </Button>
          </div>
          {newProps?.removeIcon && (
            <div className="d-inline-block ml-1">
              <Button variant="link" className="p-0"
                      style={{top: '-0.10rem', color: disabledCheckbox ? 'rgba(255, 255, 255, 0.4)' : COLOR_REDDISH}}
                      title="Remove condition"
                      disabled={disabledCheckbox}
                      onClick={() => {
                        'function' === typeof newProps?.onRemoveClick && newProps?.onRemoveClick();
                      }}>
                <IconClear width="16" height="16"/>
              </Button>
            </div>
          )}
        </Col>
      </Row>
      {expanded && (
        <>
          <div className="mt-2 mb-2">
            <Row className={cn({'text-muted': false}, 'checkbox-align')}>
              <Col xs="8">
                <div className="d-inline-block" style={{width: '80%'}}>
                  <Select
                    isDisabled={!enabled}
                    menuPortalTarget={document.body}
                    value={null}
                    formatOptionLabel={(option: Option | any) => (
                      <span>
                        <IconCondition width="17" height="17" color={COLOR_REDDISH}/>
                        {' '} {option?.label}
                      </span>
                    )}
                    options={GENERAL_CONDITIONS.map(value => ({label: capitalCase(value), value}))}
                    placeholder="Choose condition to insert..."
                    onChange={(option: Option | any, {action}): void => {
                      if (action === 'select-option' && option) {
                        const defaultConfigKey = camelCase(option?.value) as GeneralConditionKey;
                        const newCondition = merge<ConditionType>({
                            internalName: option.value as string,
                            enabled: true,
                            expanded: true,
                            template: '',
                          },
                          defaultsParams?.[defaultConfigKey] || {},
                        );
                        setSubConditions(current => ({...current, [nanoid(10)]: newCondition}));
                      }
                    }}
                  />
                </div>
              </Col>
              <Col xs="4" className="text-right">
                <div className="pt-1">
                  <div className="d-inline-block">
                    <Button variant="link" className="p-0"
                            title="Collapse all conditions"
                            style={{top: '-0.2rem', marginRight: '0.1rem'}}
                            disabled={isDisabled}
                            onClick={() => setSubConditionsProperty('expanded', false)}>
                      <IconChevronUp width="16" height="16"/>
                    </Button>
                  </div>
                  <div className="d-inline-block ml-1">
                    <Button variant="link" className="p-0"
                            title="Expand all conditions"
                            style={{top: '-0.2rem', marginRight: '0.05rem'}}
                            disabled={isDisabled}
                            onClick={() => setSubConditionsProperty('expanded', true)}>
                      <IconChevronDown width="16" height="16"/>
                    </Button>
                  </div>
                  <div className="d-inline-block">
                    <Button variant="link" className="p-0 ml-1"
                            style={{
                              top: '-0.20rem',
                              color: isDisabled ? 'rgba(255, 255, 255, .4)' : COLOR_REDDISH,
                            }}
                            title="Remove all sub conditions"
                            disabled={isDisabled}
                            onClick={() => setSubConditions({})}>
                      <IconClear width="16" height="16"/>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="mt-3">
            {subConditionsList.map(([_id, condition], index) => {
              const ConditionComponent = createConditionComponent(condition);
              const componentProps = onlyKeys<Partial<ConditionType>>(condition, [
                'internalName', 'template', 'enabled',
              ], true);

              return (
                <React.Fragment key={_id}>
                  <div style={{borderLeft: '2px solid #616978', paddingLeft: '1rem'}}>
                    <ConditionComponent
                      {...componentProps}
                      disabledCheckbox={!enabled}
                      removeIcon={true}
                      onRemoveClick={() => {
                        setSubConditions(current => {
                          const _current = {...current};
                          delete _current[_id];
                          return _current;
                        });
                      }}
                      onChange={(template: string, values: Record<string, any>) => {
                        updateSubCondition(_id, {...values, template});
                      }}/>
                  </div>
                  {index < totalCount - 1 && <hr className="mt-2 mb-2"/>}
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Properties validation
ConditionLogical.propTypes = {
  enabled: PropTypes.bool,
  operator: PropTypes.oneOf(LOGICAL_CONDITION),
  subConditions: PropTypes.shape({
    subConditions: PropTypes.shape({
      internalName: PropTypes.oneOf(GENERAL_CONDITIONS).isRequired,
    }),
  }),
  onChange: PropTypes.func,
};

export default React.memo(ConditionLogical);
