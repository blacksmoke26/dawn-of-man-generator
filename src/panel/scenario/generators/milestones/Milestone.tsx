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

// icons
import {
  COLOR_REDDISH, IconChevronDown, IconChevronUp, IconClear, IconMilestone,
} from '~/components/icons/app';

// utils
import {toString} from '~/helpers/string';
import {onlyKeys} from '~/helpers/object';
import {CONDITIONS_OPTIONS, LOGICAL_CONDITION} from '~/utils/condition';

// types
import type {Required} from 'utility-types';
import type {KVDocument} from '~/types/json.types';
import type {Milestone as MilestoneType} from '~/types/milestone.types';
import type {GeneralCondition, LogicalCondition} from '~/types/condition.types';
import {Dictionary, toLanguageString} from '~/utils/strings';

const isEqual = require('is-equal');

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
  description?: string;
  disabled?: boolean;
  disabledCheckbox?: boolean;
  expanded?: boolean;
  conditions?: MilestoneType['conditions'];

  onChange?(template: string, values: ChangedValues, strings: string): void,

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
    `<milestone id="${milestoneId.trim() || 'untitled'}">`
    + Object.values(attributes).map((attr => attr.template)).join('')
    + '</milestone>',
  );
};

/** Milestone functional component */
const Milestone = (props: Props) => {
  const newProps = merge<Required<Props>>({
    id: 'untitled',
    description: '',
    conditions: {},
    disabled: false,
    disabledCheckbox: false,
    expanded: true,
    onChange: () => {
    },
    onRemoveClick: () => {
    },
  }, props);

  const [milestoneId, setMilestoneId] = React.useState<string>(toString(newProps.id));
  const [description, setDescription] = React.useState<string>(toString(newProps.description));
  const [conditions, setConditions] = React.useState<ConditionsState>(newProps?.conditions as any);
  const [disabled, setDisabled] = React.useState<boolean>(newProps.disabled);
  const [disabledCheckbox, setDisabledCheckbox] = React.useState<boolean>(newProps.disabledCheckbox);
  const [expanded, setExpanded] = React.useState<boolean>(newProps.expanded);
  const [attributes, setAttributes] = React.useState<KVDocument>({});

  const updateSubCondition = (id: string, values: Record<string, any> = {}): void => {
    setConditions((current) => {
      return {...current, [id]: merge(current?.[id] || {}, values as Partial<ConditionsState>)};
    });
  };

  const isDisabled = disabledCheckbox || disabled;

  const removeCondition = (id: string): void => {
    setConditions(current => {
      const _current = {...current};
      delete _current[id];
      return _current;
    });
  };

  // Reflect state changes
  React.useEffect(() => {
    const langStrings: Dictionary = {
      [milestoneId.trim() || 'untitled']: description,
    };

    const template = isDisabled ? '' : toTemplateText(milestoneId, attributes);
    typeof newProps.onChange === 'function' && newProps.onChange(
      template,
      isDisabled ? {} : conditionsToValues(attributes),
      isDisabled ? '' : toLanguageString(langStrings),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled, milestoneId, description, attributes]);

  // Reflect prop changes
  React.useEffect(() => {
    //props?.id && setDisabled(props.);
    props?.id !== undefined && setMilestoneId(props.id);
    props?.description !== undefined && setDescription(props.description);
    props?.conditions !== undefined && setConditions(props.conditions as any);
    props?.disabled !== undefined && setDisabled(props.disabled);
    props?.disabledCheckbox !== undefined && setDisabledCheckbox(props.disabledCheckbox);
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
        enabled: !isDisabled,
        disabledCheckbox: isDisabled,
      } as ConditionRegistry;

      nodes.push(
        <React.Fragment key={_id}>
          <div className="ml-2 pl-3" style={{borderLeft: '2px solid rgb(97 137 97)'}}>
            <Condition
              id={_id} internalName={condition.internalName}
              values={values}
              disabledCheckbox={isDisabled}
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
    <div className={cn('mt-0 checkbox-align', {'text-muted': isDisabled})}>
      <Row className="mb-2 mt-2">
        <Col sm="2">
          <div className="position-relative" style={{top: 7}}>
            <IconMilestone width="16" height="16"/> Milestone ID
          </div>
        </Col>
        <Col sm="10">
          <Row>
            <Col sm="8" className="text-left">
              <Form.Control
                type="text"
                size="sm"

                disabled={isDisabled}
                className="pull-left"
                aria-disabled={isDisabled}
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
                <Button
                  disabled={isDisabled}
                  title={expanded ? 'Collapse milestone panel' : 'Expand milestone panel'}
                  variant="link" className="p-0" style={{top: '0.19rem'}}
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
                  disabled={disabledCheckbox}
                  checked={!disabled}
                  onChange={e => setDisabled(!e.target.checked)}
                />
              </div>
              <div className="d-inline-block">
                <Button
                  variant="link" className="p-0"
                  style={{top: 2, color: isDisabled ? 'rgba(255, 255, 255, .4)' : COLOR_REDDISH}}
                  title="Remove milestone"
                  disabled={isDisabled}
                  onClick={() => newProps.onRemoveClick()}>
                  <IconClear width="20" height="20" style={{top: 0}}/>
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className={cn({'d-none invisible': !expanded})}>
        <Row className="mb-2 mt-2">
          <Col sm="2">
            <div
              className="position-relative ml-3"
              style={{top: 7}}>
              <span
                title="Displayed as the name of the milestone, stores in a language file"
                style={{textDecoration: 'underline dotted', cursor: 'default'}}>
                Description
              </span>
            </div>
          </Col>
          <Col sm="10">
            <Row>
              <Col sm="10" className="text-left">
                <Form.Control
                  as="textarea"
                  style={{height: 50}}
                  size="sm"
                  disabled={isDisabled}
                  className="pull-left"
                  aria-disabled={isDisabled}
                  placeholder="e.g., Survive the long and cold winters..."
                  value={description}
                  onChange={e => setDescription(e.currentTarget.value)}
                />
              </Col>
            </Row>
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
  disabledCheckbox: PropTypes.bool,
  disabled: PropTypes.bool,
  conditions: PropTypes.object,
  onRemoveClick: PropTypes.func,
};

export default Milestone;
