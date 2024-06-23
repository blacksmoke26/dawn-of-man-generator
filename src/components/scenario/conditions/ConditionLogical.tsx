/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {capitalCase} from 'change-case';
import {Button, Col, Form, Row} from 'react-bootstrap';

// elemental components
import Select, {Option} from '~/components/ui/Select';

// hooks
import useAttributes from '~/hooks/use-attributes';

// utils
import {onlyKeys} from '~/helpers/object';
import {GENERAL_CONDITIONS} from '~/utils/condition';
import {
  CollapseAllButton,
  conditionIcon,
  ExpandAllButton,
  RemoveAllButton,
  RemoveButton,
} from './elements/condition-logical';

// icons
import {
  COLOR_DISABLED,
  COLOR_REDDISH,
  IconChevronSimpleDown,
  IconChevronSimpleUp,
  IconCondition,
  IconConditionLogical,
} from '~/components/icons/app';

// types
import {KVDocument} from '~/types/json.types';
import {
  type PropValues,
  type ChangedValues,
  ConditionLogicalValues,
  arrayValuesToAttributes,
  createConditionComponent,
} from './utils/condition-logical';
import {ConditionAttributesProps, LogicalCondition} from '~/types/condition.types';


/** ConditionNot `props` type */
interface Props extends ConditionAttributesProps {
  operator: LogicalCondition;
  /**
   * @example
   * [{
   *    type: 'AnyTasksActive',
   *    taskType: 'protein_hoarding',
   *    minPerformers: 150,
   *  } as ConditionAnyTasksActive,
   *  ...]
   */
  values?: ConditionLogicalValues[];

  /**
   * The changed values yield the following structure:
   * @example
   * [{
   *    type: 'AnyTasksActive',
   *    taskType: 'protein_hoarding',
   *    minPerformers: 150,
   *  }, ...
   * ]
   */
  onValuesChange?(values: ChangedValues): void;

  removeIcon?: boolean;
  showCheckbox?: boolean;

  onRemoveClick?(): void,
}

const valuesToChangedValues = (type: LogicalCondition, values: PropValues): ChangedValues => {
  const list: ChangedValues = {
    type,
    conditions: [],
  };

  const conditions = Object.values(values);

  if (!conditions.length) {
    return list;
  }

  for (const data of conditions) {
    const changedValues = onlyKeys(data, [
      'enabled',
      'expanded',
      'disabledCheckbox',
    ], true);

    list.conditions.push(changedValues);
  }

  return list;
};

function ToggleCheckbox(props: { attr: boolean, disabled: boolean, onClick: () => void }) {
  return (
    <span
      className={cn('mr-1', {'text-muted': !props.attr})}>
      <a href="#disable"
         className={cn({'text-muted': props.disabled})}
         onClick={(e) => {
           e.preventDefault();
           props.onClick();
         }} style={{
        cursor: !props.disabled ? 'pointer' : 'default',
        color: '#FFF',
      }}>
        <span className="position-relative" style={{top: 0}}>

        <IconConditionLogical
          width="17" height="17"
          color={!props.attr ? COLOR_DISABLED : COLOR_REDDISH}/>
          {' '} <strong>Condition:</strong>
          {' '} SubConditions
      </span>
      </a>
    </span>
  );
}

/** ConditionLogical functional component */
const ConditionLogical = (props: Props) => {
  const newProps = merge({
    enabled: true,
    expanded: true,
    showCheckbox: true,
    subConditions: {},
    removeIcon: false,
    onValuesChange() {
    },
  }, props);

  const [values, setValue, getValue, remValue, clearValues, setAllValues] = useAttributes<PropValues>(arrayValuesToAttributes(props?.values || []));
  const [attributes, setAttr, getAttr] = useAttributes<{
    enabled: boolean;
    disabledCheckbox: boolean;
    expanded: boolean;
    conditionsExpanded?: boolean;
  }>({
    enabled: true,
    expanded: true,
    disabledCheckbox: false,
    conditionsExpanded: undefined,
  });

  // Reflect state changes
  React.useEffect(() => {
    if (Array.isArray(props?.values)) {
      clearValues();
      setAllValues(arrayValuesToAttributes(props?.values || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.values]);

  // Reflect values changes
  React.useEffect(() => {
    newProps.onValuesChange(attributes.enabled
      ? valuesToChangedValues(props.operator, values)
      : {} as ChangedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, attributes.enabled]);

  // Reflect prop changes
  React.useEffect(() => {
    setAttr('enabled', props?.enabled, true);
    setAttr('disabledCheckbox', props?.disabledCheckbox, true);
    setAttr('expanded', props?.expanded, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.enabled, props?.disabledCheckbox, props?.expanded]);

  const subConditionsList = Object.entries(values);
  const totalCount = subConditionsList.length;

  const isDisabled = getAttr('disabledCheckbox')
    || !getAttr('enabled')
    || !Object.keys(values).length;

  return (
    <div className={cn({'text-muted': !getAttr('enabled')})}>
      <Row>
        <Col col="6" className="checkbox-align mt-1">
          {!newProps.showCheckbox && (
            <ToggleCheckbox
              attr={getAttr('enabled')}
              disabled={isDisabled} onClick={() => {
              if (!isDisabled) {
                setAttr('expanded', !getAttr('expanded'));
              }
            }}/>
          )}
          {newProps.showCheckbox && (
            <Form.Check
              type="switch"
              id={`locations_override-switch-${nanoid(5)}`}
              label={<span className="position-relative" style={{top: 0}}>
            <span className={cn('mr-1', {'text-muted': !getAttr('enabled')})}>
              <IconCondition
                width="17" height="17"
                color={!getAttr('enabled') ? COLOR_DISABLED : COLOR_REDDISH}/>
              {' '} <strong>Condition:</strong>
              {' '} SubConditions
            </span>
            </span>}
              checked={getAttr('enabled')}
              disabled={getAttr('disabledCheckbox')}
              onChange={e => {
                setAttr('enabled', e.target.checked);
              }}
            />
          )}
        </Col>
        <Col col="6" className="text-right" style={{top: 3}}>
          <div className="d-inline-block">
            <strong
              style={{color: '#ebeaea'}}
              className={cn('text-size-sm', {'text-muted': !getAttr('enabled')})}>
              {conditionIcon(newProps.operator)}
              {' '}
              <span className="position-relative" style={{top: '0.01rem'}}>
                {newProps.operator?.toUpperCase()}
              </span>
            </strong>
          </div>
          <div className="d-inline-block ml-2">
            <Button
              variant="link" className="p-0" style={{top: '-0.080rem'}}
              disabled={getAttr('disabledCheckbox')}
              onClick={() => setAttr('expanded', !getAttr('expanded'))}>
              {!getAttr('expanded')
                ? <IconChevronSimpleUp width="16" height="16"/>
                : <IconChevronSimpleDown width="16" height="16"/>}
            </Button>
          </div>
          {newProps?.removeIcon && (
            <RemoveButton
              disabledCheckbox={getAttr('disabledCheckbox')}
              onClick={() => newProps?.onRemoveClick()}/>
          )}
        </Col>
      </Row>
      {getAttr('expanded') && (
        <>
          <div className="mt-2 mb-2">
            <Row className={cn({'text-muted': false}, 'checkbox-align')}>
              <Col xs="8">
                <div className="d-inline-block" style={{width: '80%'}}>
                  <Select
                    isDisabled={!getAttr('enabled')}
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
                        setValue(nanoid(10).toLowerCase(), {type: option?.value});
                      }
                    }}
                  />
                </div>
              </Col>
              <Col xs="4" className="text-right">
                <div className="pt-1">
                  <CollapseAllButton disabled={isDisabled} onClick={() => {
                    setAttr('conditionsExpanded', false);
                    setTimeout(() => {
                      setAttr('conditionsExpanded', undefined);
                    }, 250);
                  }}/>
                  <ExpandAllButton disabled={isDisabled} onClick={() => {
                    setAttr('conditionsExpanded', true);
                    setTimeout(() => {
                      setAttr('conditionsExpanded', undefined);
                    }, 250);
                  }}/>
                  <RemoveAllButton disabled={isDisabled} onClick={() => clearValues()}/>
                </div>
              </Col>
            </Row>
          </div>
          <div className="mt-3">
            {subConditionsList.map(([_id, condition], index) => {
              const ConditionComponent = createConditionComponent(condition);
              const initialValues = onlyKeys(getValue(_id), [
                'type',
              ], true);

              return (
                <React.Fragment key={_id}>
                  <div style={{borderLeft: '2px solid #616978', paddingLeft: '1rem'}}>
                    <ConditionComponent
                      initialValues={initialValues}
                      removeIcon={true}
                      onRemoveClick={() => remValue(_id)}
                      enabled={getAttr('enabled')}
                      expanded={getAttr('conditionsExpanded', undefined)}
                      showCheckbox={false}
                      disabledCheckbox={!getAttr('enabled')}
                      onValuesChange={(changedValues: KVDocument): void => {
                        setValue(_id, {type: condition.type, ...changedValues});
                      }}
                    />
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
  /*enabled: PropTypes.bool,
  operator: PropTypes.oneOf(LOGICAL_CONDITION),
  subConditions: PropTypes.shape({
    subConditions: PropTypes.shape({
      internalName: PropTypes.oneOf(GENERAL_CONDITIONS).isRequired,
    }),
  }),
  onChange: PropTypes.func,*/
};

export default React.memo(ConditionLogical);
