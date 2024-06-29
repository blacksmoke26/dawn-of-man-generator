/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-23
 * @version 2.4
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {Col, Row} from 'react-bootstrap';

// elemental components
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import NumberInput from '~/components/ui/NumberInput';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {defaultsParams} from '~/utils/action';
import {actionDefaultProps} from './utils/default';
import {
  PERIOD_MIN,
  PERIOD_MAX,
  MIGRATION_MIN,
  MIGRATION_MAX,
  DECREASE_START_POPULATION_MIN,
  DECREASE_START_POPULATION_MAX,
  DECREASE_HALFING_POPULATION_MIN,
  DECREASE_HALFING_POPULATION_MAX,
} from '~/utils/defaults';
import {
  randomPeriod,
  randomMigrationMinMax,
  randomDecreaseStartPopulation,
  randomDecreaseHalfingPopulation,
} from '~/utils/random';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSetMigrationParameters
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetMigrationParameters> {
}

export interface SetMigrationParametersActionAttributesProps extends ActionAttributesProps {
  periodChecked: boolean;
  decreaseStartPopulationChecked: boolean;
  decreaseHalfingPopulationChecked: boolean;
  minMaxChecked: boolean;
}

const ACTION_NAME: ActionName = 'SetMigrationParameters';

const SetMigrationParameters = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetMigrationParameters>>(
    merge(defaultsParams?.setMigrationParameters || {}, props?.initialValues || {}),
  );

  const state = useValues<SetMigrationParametersActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    minMaxChecked: !valuer.is('min', undefined) || !valuer.is('max', undefined),
    periodChecked: !valuer.is('period', undefined),
    decreaseStartPopulationChecked: !valuer.is('decreaseStartPopulation', undefined),
    decreaseHalfingPopulationChecked: !valuer.is('decreaseHalfingPopulation', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.minMaxChecked && (changeValues.min = changeValues.max = undefined);
    !state.data.periodChecked && (changeValues.period = undefined);
    !state.data.decreaseStartPopulationChecked && (changeValues.decreaseStartPopulation = undefined);
    !state.data.decreaseHalfingPopulationChecked && (changeValues.decreaseHalfingPopulation = undefined);

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.minMaxChecked,
    state.data.periodChecked,
    state.data.decreaseStartPopulationChecked,
    state.data.decreaseHalfingPopulationChecked,
  ]);

  // Reflect state.data changes
  React.useEffect(() => {
    newProps.onChange(state.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data]);

  // Reflect prop changes
  React.useEffect(() => {
    state.set('disabled', props?.disabled, true);
    state.set('disabledCheckbox', props?.disabledCheckbox, true);
    state.set('expanded', props?.expanded, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.disabled, props?.disabledCheckbox, props?.expanded]);

  const isDisabled = state.get<boolean>('disabledCheckbox', false) || state.get<boolean>('disabled', false);
  const minMaxDisabled: boolean = newProps.disabled || !state.get<boolean>('minMaxChecked', false);

  return (
    <div className={cn('mb-2', {'text-muted': isDisabled}, 'checkbox-align')}>
      {newProps?.showHeader && (
        <ActionHeader
          caption={ACTION_NAME}
          disabled={state.data.disabled}
          disabledCheckbox={state.data.disabledCheckbox}
          removeIcon={newProps.removeIcon}
          onRemoveClick={newProps.onRemoveClick}
          onExpandedClick={(current: boolean) => state.set('expanded', current)}
          expanded={state.data.expanded}/>
      )}
      {state.data.expanded && (
        <>
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption="Migrators"
                checked={state.get<boolean>('minMaxChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, [['min', 1], ['max', 1]]]}
                onChange={isChecked => {
                  state.set('minMaxChecked', isChecked);
                }}
              />
              <AttributeRangeValue
                colProps={{sm: '6'}}
                disabled={minMaxDisabled}
                min={valuer.get('min', 1)}
                max={valuer.get('max', 1)}
                sliderProps={{min: MIGRATION_MIN, max: MIGRATION_MAX}}
                allowRestore
                onRestore={(excludeMin, excludeMax) => {
                  !excludeMin && valuer.set('min', 1);
                  !excludeMax && valuer.set('max', 1);
                }}
                allowShuffle
                onShuffle={(excludeMin, excludeMax) => {
                  const [min, max] = randomMigrationMinMax();
                  !excludeMin && valuer.set('min', min);
                  !excludeMax && valuer.set('max', max);
                }}
                onChange={(min, max) => {
                  valuer.set('min', min);
                  valuer.set('max', max);
                }}
                allowExcludeCheck
              />
            </Row>
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption="Period"
                checked={state.get<boolean>('periodChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'period', 0.5]}
                onChange={isChecked => {
                  state.set('periodChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  labelAfter="y"
                  maxLength={3}
                  min={PERIOD_MIN}
                  max={PERIOD_MAX}
                  decimals={1}
                  disabled={isDisabled || !state.get<boolean>('periodChecked', false)}
                  placeholder="e.g. 0.5"
                  value={valuer.get('period', 0.5)}
                  onChange={value => valuer.set('period', value)}
                  shuffle
                  onShuffle={() => valuer.set('period', randomPeriod())}
                  allowRestore
                  onRestore={() => valuer.set('period', 0.5)}
                />
              </Col>
            </Row>
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption={<>Decrease start <i className="text-size-xxs text-muted">(population)</i></>}
                checked={state.get<boolean>('decreaseStartPopulationChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'decreaseStartPopulation', 50]}
                onChange={isChecked => {
                  state.set('decreaseStartPopulationChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  maxLength={3}
                  min={DECREASE_START_POPULATION_MIN}
                  max={DECREASE_START_POPULATION_MAX}
                  disabled={isDisabled || !state.get<boolean>('decreaseStartPopulationChecked', false)}
                  placeholder="e.g. 50"
                  value={valuer.get('decreaseStartPopulation', 50)}
                  onChange={value => valuer.set('decreaseStartPopulation', value)}
                  shuffle
                  onShuffle={() => valuer.set('decreaseStartPopulation', randomDecreaseStartPopulation())}
                  allowRestore
                  onRestore={() => valuer.set('decreaseStartPopulation', 50)}
                />
              </Col>
            </Row>
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption={<>Decrease halfing <i className="text-size-xxs text-muted">(population)</i></>}
                checked={state.get<boolean>('decreaseHalfingPopulationChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'decreaseHalfingPopulation', 50]}
                onChange={isChecked => {
                  state.set('decreaseHalfingPopulationChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  maxLength={3}
                  min={DECREASE_HALFING_POPULATION_MIN}
                  max={DECREASE_HALFING_POPULATION_MAX}
                  disabled={isDisabled || !state.get<boolean>('decreaseHalfingPopulationChecked', false)}
                  placeholder="e.g. 30"
                  value={valuer.get('decreaseHalfingPopulation', 50)}
                  onChange={value => valuer.set('decreaseHalfingPopulation', value)}
                  shuffle
                  onShuffle={() => valuer.set('decreaseHalfingPopulation', randomDecreaseHalfingPopulation())}
                  allowRestore
                  onRestore={() => valuer.set('decreaseHalfingPopulation', 50)}
                />
              </Col>
            </Row>
          </Accordion>

          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
              if (state.is('minMaxChecked', true)) {
                const [min, max] = randomMigrationMinMax();
                valuer.set('min', min);
                valuer.set('max', max);
              }

              if (state.is('periodChecked', true)) {
                valuer.set('period', randomPeriod());
              }

              if (state.is('decreaseHalfingPopulationChecked', true)) {
                valuer.set('decreaseStartPopulation', randomDecreaseStartPopulation());
              }

              if (state.is('decreaseHalfingPopulationChecked', true)) {
                valuer.set('decreaseHalfingPopulation', randomDecreaseHalfingPopulation());
              }
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
SetMigrationParameters.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    min: PropTypes.number,
    max: PropTypes.number,
    period: PropTypes.number,
    decreaseStartPopulation: PropTypes.number,
    decreaseHalfingPopulation: PropTypes.number,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetMigrationParameters;
