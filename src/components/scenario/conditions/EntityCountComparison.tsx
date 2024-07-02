/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {capitalCase} from 'change-case';
import {Col, Row} from 'react-bootstrap';
import uniqueRandomArray from 'unique-random-array';

// elemental components
import Accordion from '~/components/ui/Accordion';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import ConditionHeader from './../elements/ConditionHeader';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';

// hooks
import useValues from '~/hooks/use-values';

// utils
import * as random from '~/utils/random';
import {ENTITIES, ENTITIES_OPTIONS} from '~/utils/entities';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';
import {
  COMPARISONS,
  COUNTERS,
  defaultsParams,
  ENTITY_COUNT_DEFAULT,
  ENTITY_COUNT_MAX,
  ENTITY_COUNT_MIN,
} from '~/utils/condition';

// types
import type {Option} from '~/components/ui/Select';
import type {
  ConditionAttributesProps, ConditionEntityCountComparison, ConditionProps,
} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionEntityCountComparison> {
}

export interface EntityCountComparisonAttributes extends ConditionAttributesProps {
  counterChecked: boolean;
  valueChecked: boolean;
}

const CONDITION_NAME: string = 'EntityCountComparison';

const EntityCountComparison = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionEntityCountComparison>>(
    merge(defaultsParams?.entityCountComparison || {}, props?.initialValues || {}),
  );

  const state = useValues<EntityCountComparisonAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    counterChecked: !valuer.is('counter', undefined),
    valueChecked: !valuer.is('value', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.counterChecked && (changeValues.counter = undefined);
    !state.data.valueChecked && (changeValues.value = undefined);

    newProps?.onTemplate(toConditionTemplate('EntityCountComparison', changeValues, !state.data.enabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.enabled, valuer.data,
    state.data.counterChecked,
    state.data.valueChecked,
  ]);

  // Reflect state changes
  React.useEffect(() => {
    newProps.onChange(state.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data]);

  // Reflect prop changes
  React.useEffect(() => {
    state.set('enabled', props?.enabled, true);
    state.set('disabledCheckbox', props?.disabledCheckbox, true);
    state.set('expanded', props?.expanded, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.enabled, props?.disabledCheckbox, props?.expanded]);

  const isDisabled = state.data.disabledCheckbox || !state.data.enabled;

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      <ConditionHeader
        caption={CONDITION_NAME} showCheckbox={newProps.showCheckbox}
        enabled={state.data.enabled}
        onEnabled={(isEnabled: boolean) => state.set('enabled', isEnabled)}
        disabledCheckbox={state.data.disabledCheckbox}
        removeIcon={newProps.removeIcon}
        onRemoveClick={newProps.onRemoveClick}
        onExpandedClick={(isExpended: boolean) => state.set('expanded', isExpended)}
        expanded={state.data.expanded}/>
      {state.data.expanded && (
        <>
          <Row className="mb-1 mt-2">
            <PropertyLabel caption="Entity Type"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: 6}}
              disabled={isDisabled}
              options={ENTITIES_OPTIONS as unknown as Option[]}
              value={valuer.get('entityType', 'primitive_human')}
              onSelect={option => valuer.set('entityType', option.value)}
              allowShuffle
              onShuffle={() => valuer.set('entityType', uniqueRandomArray(ENTITIES))}
            />
          </Row>
          <Row className="mb-2 mt-2">
            <PropertyLabel caption="Comparison"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: 6}}
              disabled={isDisabled}
              options={COMPARISONS.map(value => ({label: capitalCase(value), value}))}
              value={valuer.get('comparison', 'Equals')}
              onSelect={option => valuer.set('comparison', option.value)}
              allowShuffle
              onShuffle={() => valuer.set('comparison', uniqueRandomArray(COMPARISONS))}
            />
          </Row>

          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mb-1 mt-2">
              <PropertyCheckboxLabel
                caption="Counter"
                checked={state.get<boolean>('counterChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'counter', 'All']}
                onChange={isChecked => state.set('counterChecked', isChecked)}
              />
              <AttributeSelect
                className="w-75"
                colProps={{sm: 6}}
                disabled={isDisabled || !state.data.counterChecked}
                options={COUNTERS.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('counter', 'All')}
                onSelect={option => valuer.set('counter', option.value)}
                allowShuffle
                onShuffle={() => valuer.set('counter', uniqueRandomArray(COUNTERS))}
              />
            </Row>
            <Row className="mb-1 mt-2">
              <PropertyCheckboxLabel
                caption="Value"
                checked={state.get<boolean>('valueChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'value', 50]}
                onChange={isChecked => state.set('valueChecked', isChecked)}
              />
              <Col xs="4">
                <NumberInput
                  maxLength={3}
                  min={ENTITY_COUNT_MIN}
                  max={ENTITY_COUNT_MAX}
                  disabled={isDisabled || !state.data.valueChecked}
                  value={valuer.get<number>('value', 50)}
                  onChange={value => valuer.set('value', value)}
                  shuffle={true}
                  onShuffle={() => valuer.set('value', random.randomEntityCount())}
                  allowRestore
                  onRestore={() => valuer.set('value', ENTITY_COUNT_DEFAULT)}
                />
              </Col>
            </Row>
          </Accordion>
        </>
      )}
    </div>
  );
};

// Properties validation
EntityCountComparison.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  counter: PropTypes.oneOf(COUNTERS),
  entityType: PropTypes.oneOf(ENTITIES),
  value: PropTypes.number,
  comparison: PropTypes.oneOf(COMPARISONS),*/
};

export default EntityCountComparison;
