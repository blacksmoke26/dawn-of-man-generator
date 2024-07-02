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
import ConditionHeader from './../elements/ConditionHeader';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';

// hooks
import useValues from '~/hooks/use-values';

// utils
import * as random from '~/utils/random';
import {PERIOD_MAX, PERIOD_MIN} from '~/utils/defaults';
import {defaultsParams, TIME_ELAPSED} from '~/utils/condition';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';

// types
import type {ConditionAttributesProps, ConditionTimeElapsed, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionTimeElapsed> {
}

export interface TimeElapsedAttributes extends ConditionAttributesProps {
  timerChecked: boolean;
  valueChecked: boolean;
}

const CONDITION_NAME: string = 'TimeElapsed';

const TimeElapsed = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionTimeElapsed>>(
    merge(defaultsParams?.timeElapsed || {}, props?.initialValues || {}),
  );

  const state = useValues<TimeElapsedAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    timerChecked: !valuer.is('timer', undefined),
    valueChecked: !valuer.is('value', undefined),
  });
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.valueChecked && (changeValues.value = undefined);
    !state.data.timerChecked && (changeValues.timer = undefined);

    newProps?.onTemplate(toConditionTemplate('TimeElapsed', changeValues, !state.data.enabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.enabled, valuer.data,
    state.data.timerChecked,
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
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mb-1 mt-2">
              <PropertyCheckboxLabel
                caption="Timer"
                checked={state.get<boolean>('timerChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'timer', 'RealTime']}
                onChange={isChecked => state.set('timerChecked', isChecked)}
              />
              <AttributeSelect
                className="w-75"
                colProps={{sm: 6}}
                disabled={isDisabled || !state.data.timerChecked}
                options={TIME_ELAPSED.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('timer', 'RealTime')}
                onSelect={option => valuer.set('timer', option.value)}
                allowShuffle
                onShuffle={() => valuer.set('timer', uniqueRandomArray(TIME_ELAPSED))}
              />
            </Row>

            <Row className="mb-1 mt-2">
              <PropertyCheckboxLabel
                caption="Value"
                checked={state.get<boolean>('valueChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'value', 0]}
                onChange={isChecked => state.set('valueChecked', isChecked)}
              />
              <Col xs="4">
                <NumberInput
                  maxLength={3}
                  min={PERIOD_MIN}
                  max={PERIOD_MAX}
                  decimals={1}
                  disabled={isDisabled || !state.data.valueChecked}
                  value={valuer.get<number>('value', 0)}
                  onChange={value => valuer.set('value', value)}
                  shuffle={true}
                  labelAfter="y"
                  onShuffle={() => valuer.set('value', random.randomPeriod())}
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
TimeElapsed.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  timer: PropTypes.oneOf(ENTITIES),
  value: PropTypes.number,*/
};

export default TimeElapsed;
