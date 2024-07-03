// noinspection HtmlUnknownAnchorTarget

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {capitalCase} from 'change-case';
import {Col, Row} from 'react-bootstrap';

// elemental components
import Select, {Option} from '~/components/ui/Select';

// icons
import {COLOR_REDDISH, IconCondition} from '~/components/icons/app';

// hooks
import useAttributes from '~/hooks/use-attributes';

// utils
import {onlyKeys} from '~/helpers/object';
import {GENERAL_CONDITIONS, LOGICAL_CONDITION} from '~/utils/condition';
import {
  RemoveButton,
  ExpandAllButton,
  RemoveAllButton,
  CollapseAllButton, ToggleExpand, OperatorIcon, ToggleIcon, ToggleCheckbox,
} from './elements/condition-logical';
import {
  arrayValuesToAttributes, createConditionComponent,
} from './utils/condition-logical';

// types
import type {KVDocument} from '~/types/json.types';
import type {PropValues, ChangedValues, ConditionLogicalValues} from './utils/condition-logical';
import type {ConditionAttributesProps, LogicalCondition} from '~/types/condition.types';

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
    list.conditions.push(onlyKeys(data, [
      'enabled', 'expanded', 'disabledCheckbox',
    ], true));
  }

  return list;
};


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

  const [values, setValue, , remValue, clearValues] = useAttributes<PropValues>(arrayValuesToAttributes(props?.values || []));
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

  // Reflect values changes
  React.useEffect(() => {
    newProps.onValuesChange(valuesToChangedValues(props.operator, values));
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
        <Col col="6" className="checkbox-align">
          {!newProps.showCheckbox && (
            <ToggleCheckbox
              attr={getAttr('enabled')}
              disabled={isDisabled} onClick={() => {
                !isDisabled && setAttr('expanded', !getAttr('expanded'));
            }}/>
          )}
          {newProps.showCheckbox && (
            <ToggleExpand
              disabled={!getAttr('enabled')}
              disabledCheckbox={getAttr('disabledCheckbox')}
              onChange={isEnabled => setAttr('enabled', isEnabled)}
            />
          )}
        </Col>
        <Col col="6" className="text-right" style={{top: 1}}>
          <OperatorIcon
            operator={newProps.operator}
            disabled={!getAttr('enabled') || !totalCount}/>

          <ToggleIcon
            disabled={!getAttr('enabled')}
            disabledCheckbox={getAttr('disabledCheckbox')}
            expanded={getAttr('expanded')}
            onClick={() => setAttr('expanded', !getAttr('expanded'))}/>

          {newProps?.removeIcon && (
            <RemoveButton
              disabled={getAttr('disabledCheckbox')}
              onClick={() => newProps?.onRemoveClick()}/>
          )}
        </Col>
      </Row>
      {getAttr('expanded') && (
        <>
          <div className="mb-2" style={{marginTop: 7}}>
            <Row className={cn({'text-muted': false}, 'checkbox-align')}>
              <Col sm="8">
                <Select
                  isDisabled={!getAttr('enabled')}
                  menuPortalTarget={document.body}
                  value={null}
                  formatOptionLabel={(option: Option | any) => (
                    <>
                      <IconCondition
                        width="17" height="17"
                        className="d-inline-block mr-1"
                        color={COLOR_REDDISH}/>
                      {option?.label}
                    </>
                  )}
                  options={GENERAL_CONDITIONS.map(value => ({label: capitalCase(value), value}))}
                  placeholder="Choose condition to insert..."
                  onChange={(option: Option | any, {action}): void => {
                    if (action === 'select-option' && option) {
                      setValue(nanoid(10).toLowerCase(), {type: option?.value});
                    }
                  }}
                />
              </Col>
              <Col sm="4" className="text-right">
                <div>
                  <CollapseAllButton disabled={isDisabled} onClick={() => {
                    setAttr('conditionsExpanded', false);
                    setTimeout(() => setAttr('conditionsExpanded', undefined), 250);
                  }}/>
                  <ExpandAllButton disabled={isDisabled} onClick={() => {
                    setAttr('conditionsExpanded', true);
                    setTimeout(() => setAttr('conditionsExpanded', undefined), 250);
                  }}/>
                  <RemoveAllButton disabled={isDisabled} onClick={() => clearValues()}/>
                </div>
              </Col>
            </Row>
          </div>
          <div className="mt-3">
            {subConditionsList.map(([_id, condition], index) => {
              const ConditionComponent = createConditionComponent(condition);
              const initialValues = {...condition} as KVDocument;
              delete initialValues.type;

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
  enabled: PropTypes.bool,
  operator: PropTypes.oneOf(LOGICAL_CONDITION),
  values: PropTypes.array,
  onChange: PropTypes.func,
};

export default React.memo(ConditionLogical);
