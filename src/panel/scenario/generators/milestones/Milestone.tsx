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
import {Button, Col, Form, Row} from 'react-bootstrap';

// elemental components
import Select, {Option} from '~/components/ui/Select';
import Condition, {ConditionRegistry, ConditionsState} from '~/components/scenario/generic/Condition';

// utils
import {toString} from '~/helpers/string';
import {onlyKeys} from '~/helpers/object';
import {CONDITIONS_OPTIONS, LOGICAL_CONDITION} from '~/utils/condition';

// types
import type {Required} from 'utility-types';
import type {Milestone as MilestoneType} from '~/types/milestone.types';
import type {GeneralCondition, LogicalCondition} from '~/types/condition.types';
import {COLOR_REDDISH, IconChevronDown, IconChevronUp, IconClear, IconMilestone} from '~/components/icons/app';

const isEqual = require('is-equal');

type KVDocument = { [key: string]: any };

export interface ChangedValues {
  [key: string]:
    { type: GeneralCondition } & KVDocument
    | {
    type: LogicalCondition,
    subConditions: { type: GeneralCondition } & KVDocument
  } & KVDocument;
}

export interface Props {
  id?: string;
  disabled?: boolean;
  expanded?: boolean;
  conditions?: MilestoneType['conditions'];

  onChange?(template: string, values: ChangedValues): void,
  onRemoveClick?(): void,
}

const omitProps = <T extends KVDocument = KVDocument>(props: T): T => {
  return onlyKeys(props, ['expanded'], true) as T;
};

const conditionsToValues = (conditions: KVDocument): ChangedValues => {
  const registry: ChangedValues = {};
  let index = 0;

  for (const [, condition] of Object.entries(conditions)) {
    index++;
    registry[`condition_${index}`] = onlyKeys(condition, ['expanded', 'disabledCheckbox', 'enabled', 'template'], true);
  }

  return registry;
};

const toTemplateText = (milestoneId: string, attributes: KVDocument): string => {
  return xmlFormatter(
    `<milestone id="${milestoneId.trim() || 'untitled'}">\n\t`
    + Object.values(attributes).map((attr => attr.template)).join('\t\n')
    + '</milestone>',
  );
};

/** Milestone functional component */
const Milestone = (props: Props) => {
  const newProps = merge<Required<Props>>({
    id: '',
    conditions: {},
    disabled: false,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, props);

  const [milestoneId, setMilestoneId] = React.useState<string>(toString(newProps.id));
  const [conditions, setConditions] = React.useState<ConditionsState>(newProps?.conditions as any);
  const [disabled, setDisabled] = React.useState<boolean>(newProps.disabled);
  const [expanded, setExpanded] = React.useState<boolean>(newProps.expanded);
  const [attributes, setAttributes] = React.useState<KVDocument>({});

  const updateSubCondition = (id: string, values: Record<string, any> = {}): void => {
    setConditions((current) => {
      return {...current, [id]: merge(current?.[id] || {}, values as Partial<ConditionsState>)};
    });
  };

  const removeCondition = (id: string): void => {
    setConditions(current => {
      const _current = {...current};
      delete _current[id];
      return _current;
    });
  };

  // Reflect state changes
  React.useEffect(() => {
    const template = disabled ? '' : toTemplateText(milestoneId, attributes);
    typeof newProps.onChange === 'function' && newProps.onChange(template, disabled ? {} : conditionsToValues(attributes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, milestoneId, attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    //props?.id && setDisabled(props.);
    props?.id !== undefined && setMilestoneId(props.id);
    props?.conditions !== undefined && setConditions(props.conditions as any);
    //console.log('props.conditions:', props?.conditions);
    props?.disabled !== undefined && setDisabled(props.disabled);
    //props?.expanded !== undefined && setExpanded(props.expanded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  /** Generate selection based nodes */
  const renderConditions = (): React.ReactElement[] => {
    const nodes: React.ReactElement[] = [];

    const totalCount = Object.keys(conditions).length;
    let index = 0;

    for (const [_id, condition] of Object.entries(conditions)) {
      const values = {
        ...condition,
        enabled: !disabled,
        disabledCheckbox: disabled,
      } as ConditionRegistry;

      nodes.push(
        <React.Fragment key={_id}>
          <div className="ml-2 pl-3" style={{borderLeft: '2px solid #616978'}}>
            <Condition id={_id} internalName={condition.internalName}
                       values={values}
                       disabledCheckbox={disabled}
                       onChange={(template: string, values) => {
                         const nextState = {...omitProps(values), template};
                         setAttributes(prevState => {
                           if (isEqual(prevState[_id], nextState)) {
                             return prevState as ChangedValues;
                           }
                           return {...prevState, [_id]: nextState} as ChangedValues;
                         });
                       }}
                       onRemoveClick={() => {
                         removeCondition(_id);
                         setAttributes(prevState => {
                           const current = {...prevState};
                           delete current[_id];
                           return current;
                         });
                       }}
            />
          </div>
          {index < totalCount - 1 && <hr className="mt-2 mb-2"/>}
        </React.Fragment>,
      );
      index++;
    }

    return nodes;
  };

  return (
    <div className={cn('mt-0 checkbox-align', {'text-muted': disabled})}>
      <Row className="mb-2 mt-2">
        <Col sm="2">
          <div className="position-relative" style={{top: 7}}><IconMilestone width="16" height="16"/> Milestone ID</div>
        </Col>
        <Col sm="10">
          <Row>
            <Col sm="8" className="text-left">
              <Form.Control
                type="text"
                size="sm"
                disabled={disabled}
                className="pull-left"
                aria-disabled={disabled}
                id={`condition-${nanoid(5)}`}
                placeholder="e.g., survival_5_weeks"
                value={milestoneId}
                onChange={e => {
                  setMilestoneId(e.target.value.replace(/(['" \t]|[^a-z_\d])+/ig, `_`));
                }}
                onKeyUp={e => {
                  // @ts-ignore
                  e.target.value = e.target.value.replace(/(['" \t]|[^a-z_\d])+/ig, `_`).toLowerCase();
                }}
              />
            </Col>
            <Col sm="4" className="text-right">
              <div className="d-inline-block p-0">
                <Button title={expanded? 'Collapse milestone panel' : 'Expand milestone panel'} variant="link" className="p-0" style={{top: '0.19rem'}}
                        onClick={() => setExpanded(!expanded)}>
                  {!expanded
                    ? <IconChevronUp width="16" height="16"/>
                    : <IconChevronDown width="16" height="16"/>}
                </Button>
              </div>
              <div className="d-inline-block mr-1" title="Allow milestone for a current scenerio">
                <Form.Check
                  type="switch"
                  style={{top: 7}}
                  id={`allow_milestone-switch-${nanoid(5)}`}
                  label=""
                  checked={!disabled}
                  onChange={e => setDisabled(!e.target.checked)}
                />
              </div>
              <div className="d-inline-block">
                <Button variant="link" className="p-0"
                        style={{top: 2, color: COLOR_REDDISH}}
                        title="Remove milestone"
                        onClick={() => newProps.onRemoveClick()}>
                  <IconClear width="18" height="18"/>
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className={cn({'d-none invisible': !expanded})}>
        <div className="mt-2 mb-3">
          <Select
            isDisabled={disabled}
            menuPortalTarget={document.body}
            options={CONDITIONS_OPTIONS}
            value={null}
            placeholder="Add milestone condition..."
            onChange={(option: Option | any, {action}): void => {
              if (action === 'select-option' && option) {
                const conditionId: string = nanoid(10).toLowerCase();
                const values = {
                  internalName: option.value as string,
                  disabledCheckbox: false,
                  enabled: true,
                  expanded: true,
                  template: '',
                } as ConditionRegistry;

                if (LOGICAL_CONDITION.includes(option.value)) {
                  values['subConditions'] = {};
                  values['operator'] = option.value;
                }
                updateSubCondition(conditionId, values);
                setAttributes(current => ({
                  ...current, [conditionId]: {
                    template: '',
                  },
                }));
              }
            }}
          />
        </div>
        {renderConditions()}
      </div>
      <div className="mb-3"></div>
    </div>
  );
};

// Properties validation
Milestone.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  conditions: PropTypes.object,
  onRemoveClick: PropTypes.func,
};

export default Milestone;
