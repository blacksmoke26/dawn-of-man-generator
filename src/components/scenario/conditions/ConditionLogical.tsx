// noinspection HtmlUnknownAnchorTarget

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
import {Col, Row} from 'react-bootstrap';

// elemental components
import Select, {Option} from '~/components/ui/Select';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {onlyKeys} from '~/helpers/object';
import {GENERAL_CONDITIONS} from '~/utils/condition';
import {
  CollapseAllButton,
  ExpandAllButton,
  OperatorIcon,
  RemoveAllButton,
  RemoveButton,
  ToggleCheckbox,
  ToggleExpand,
  ToggleIcon,
} from './elements/condition-logical';
import {
  arrayValuesToAttributes,
  conditionDefaultProps,
  createConditionComponent,
  SubConditionAttributes,
} from './utils/condition-logical';

// icons
import {COLOR_REDDISH, IconCondition} from '~/components/icons/app';

// types
import type {KVDocument} from '~/types/json.types';
import type {ConditionAttributesProps, LogicalCondition} from '~/types/condition.types';
import type {ChangedValues, ConditionLogicalValues, PropValues} from './utils/condition-logical';

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

export interface ConditionAttributes {
  enabled: boolean,
  expanded: boolean,
  disabledCheckbox: boolean,
  conditionsExpanded: boolean,
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

/** ConditionLogical functional component */
const ConditionLogical = (props: Props) => {
  const newProps = merge(conditionDefaultProps, props);

  const state = useValues<ConditionAttributes>({
    enabled: true,
    expanded: true,
    disabledCheckbox: false,
    conditionsExpanded: true,
  });

  const subCondition = useValues<SubConditionAttributes>(arrayValuesToAttributes(props?.values || []));

  // Reflect state changes
  React.useEffect(() => {
    if (Array.isArray(props?.values)) {
      subCondition.clear();
      subCondition.setAll(arrayValuesToAttributes(props?.values || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.values]);

  // Reflect values changes
  React.useEffect(() => {
    newProps.onValuesChange(state.data.enabled
      ? valuesToChangedValues(props.operator, subCondition.data)
      : {} as ChangedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data.enabled, subCondition.data]);

  // Reflect prop changes
  React.useEffect(() => {
    state.set('enabled', props?.enabled, true);
    state.set('disabledCheckbox', props?.disabledCheckbox, true);
    state.set('expanded', props?.expanded, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.enabled, props?.disabledCheckbox, props?.expanded]);

  const subConditionsList = Object.entries(subCondition.data);
  const totalCount = subConditionsList.length;

  const isDisabled = state.data.disabledCheckbox
    || !state.data.enabled
    || !Object.keys(subCondition.data).length;

  return (
    <div className={cn({'text-muted': !state.data.enabled})}>
      <Row>
        <Col col="6" className="checkbox-align">
          {!newProps.showCheckbox && (
            <ToggleCheckbox
              attr={state.data.enabled}
              disabled={isDisabled} onClick={() => {
              if (!isDisabled) {
                state.set('expanded', current => !current);
              }
            }}/>
          )}
          {newProps.showCheckbox && (
            <ToggleExpand
              disabled={!state.data.enabled}
              disabledCheckbox={state.data.disabledCheckbox}
              onChange={isEnabled => {
                state.set('enabled', isEnabled);
              }}
            />
          )}
        </Col>
        <Col col="6" className="text-right" style={{top: 1}}>
          <OperatorIcon
            operator={newProps.operator}
            disabled={!state.data.enabled || !totalCount}/>

          <ToggleIcon
            disabled={!state.data.enabled}
            disabledCheckbox={state.data.disabledCheckbox}
            expanded={state.data.expanded}
            onClick={() => state.set('expanded', current => !current)}/>

          {newProps?.removeIcon && (
            <RemoveButton
              disabled={state.data.disabledCheckbox}
              onClick={() => newProps?.onRemoveClick()}
            />
          )}
        </Col>
      </Row>

      {state.data.expanded && (
        <>
          <div className="mb-2" style={{marginTop: 7}}>
            <Row className={cn({'text-muted': false}, 'checkbox-align')}>
              <Col sm="8">
                <Select
                  isDisabled={!state.data.enabled}
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
                      subCondition.set(nanoid(10).toLowerCase(), {type: option?.value});
                    }
                  }}
                />
              </Col>
              <Col sm="4" className="text-right">
                <div>
                  <CollapseAllButton disabled={isDisabled} onClick={() => {
                    state.set('conditionsExpanded', false);
                    setTimeout(() => {
                      state.set('conditionsExpanded', undefined);
                    }, 250);
                  }}/>
                  <ExpandAllButton disabled={isDisabled} onClick={() => {
                    state.set('conditionsExpanded', true);
                    setTimeout(() => {
                      state.set('conditionsExpanded', undefined);
                    }, 250);
                  }}/>
                  <RemoveAllButton disabled={isDisabled} onClick={() => subCondition.clear()}/>
                </div>
              </Col>
            </Row>
          </div>
          <div className="mt-3">
            {subConditionsList.map(([_id, condition], index) => {
              const ConditionComponent = createConditionComponent(condition);
              const initialValues = onlyKeys(subCondition.get(_id), [
                'type',
              ], true);

              return (
                <React.Fragment key={_id}>
                  <div style={{borderLeft: '2px solid #616978', paddingLeft: '1rem'}}>
                    <ConditionComponent
                      initialValues={initialValues}
                      removeIcon
                      onRemoveClick={() => subCondition.remove(_id)}
                      enabled={state.data.enabled}
                      expanded={state.data.conditionsExpanded}
                      showCheckbox={false}
                      disabledCheckbox={!state.data.enabled}
                      onValuesChange={(changedValues: KVDocument): void => {
                        subCondition.overwrite(_id, {type: condition.type, ...changedValues})
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
