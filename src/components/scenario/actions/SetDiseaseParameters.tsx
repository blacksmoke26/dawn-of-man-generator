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

// hooks
import useValues from '~/hooks/use-values';

// utils
import {actionDefaultProps} from './utils/default';
import {defaultsParams} from '~/utils/action';
import {INDIVIDUAL_DISEASE_CHANCE_MAX, INDIVIDUAL_DISEASE_CHANCE_MIN, PERIOD_MAX, PERIOD_MIN} from '~/utils/defaults';
import {randomIndividualDiseaseChance, randomPeriod} from '~/utils/random';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSetDiseaseParameters
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetDiseaseParameters> {
}

export interface SetDiseaseParametersActionAttributesProps extends ActionAttributesProps {
  periodChecked: boolean;
  varianceChecked: boolean;
  individualDiseaseChanceChecked: boolean;
}

const ACTION_NAME: ActionName = 'SetDiseaseParameters';

const SetDiseaseParameters = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetDiseaseParameters>>(
    merge(defaultsParams?.setDiseaseParameters || {}, props?.initialValues || {}),
  );

  const state = useValues<SetDiseaseParametersActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    periodChecked: !valuer.is('period', undefined),
    varianceChecked: !valuer.is('variance', undefined),
    individualDiseaseChanceChecked: !valuer.is('individualDiseaseChance', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.periodChecked) {
      changeValues.period = undefined;
    }

    if (!state.data.varianceChecked) {
      changeValues.variance = undefined;
    }

    if (!state.data.individualDiseaseChanceChecked) {
      changeValues.individualDiseaseChance = undefined;
    }

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.periodChecked,
    state.data.varianceChecked,
    state.data.individualDiseaseChanceChecked,
  ]);

  // Reflect state changes
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
  // period
  // variance
  // individualDiseaseChance
  return (
    <div className={cn('mb-2 checkbox-align', {'text-muted': isDisabled})}>
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
                  decimals={1}
                  min={PERIOD_MIN}
                  max={PERIOD_MAX}
                  disabled={isDisabled || !state.get<boolean>('periodChecked', false)}
                  placeholder="e.g. 0.5"
                  value={valuer.get('period', 0.5)}
                  onChange={value => valuer.set('period', value)}
                  shuffle
                  onShuffle={() => valuer.set('period', randomPeriod())}
                  allowRestore
                  onRestore={() => valuer.set('period', defaultsParams.setDiseaseParameters?.period)}
                />
              </Col>
            </Row>
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption="Variance"
                checked={state.get<boolean>('varianceChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'variance', 1.5]}
                onChange={isChecked => {
                  state.set('varianceChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  labelAfter="y"
                  maxLength={3}
                  decimals={1}
                  min={PERIOD_MIN}
                  max={PERIOD_MAX}
                  disabled={isDisabled || !state.get<boolean>('varianceChecked', false)}
                  placeholder="e.g. 1.5"
                  value={valuer.get('variance', 1.5)}
                  onChange={value => valuer.set('variance', value)}
                  shuffle
                  onShuffle={() => valuer.set('variance', randomPeriod())}
                  allowRestore
                  onRestore={() => valuer.set('variance', defaultsParams.setDiseaseParameters?.variance)}
                />
              </Col>
            </Row>
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption="Disease chance (individual)"
                checked={state.data.individualDiseaseChanceChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'individualDiseaseChance', 0.5]}
                onChange={isChecked => state.set('individualDiseaseChanceChecked', isChecked)}
              />
              <Col sm="4">
                <NumberInput
                  maxLength={3}
                  decimals={2}
                  min={INDIVIDUAL_DISEASE_CHANCE_MIN}
                  max={INDIVIDUAL_DISEASE_CHANCE_MAX}
                  disabled={isDisabled || !state.data.individualDiseaseChanceChecked}
                  placeholder="e.g. 0.5"
                  value={valuer.get('individualDiseaseChance', 0.5)}
                  onChange={value => valuer.set('individualDiseaseChance', value)}
                  shuffle
                  onShuffle={() => valuer.set('individualDiseaseChance', randomIndividualDiseaseChance())}
                  allowRestore
                  onRestore={() => valuer.set('individualDiseaseChance', defaultsParams.setDiseaseParameters?.individualDiseaseChance)}
                />
              </Col>
            </Row>
          </Accordion>
          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
              state.is('periodChecked', true)
              && valuer.set('period', randomPeriod());

              state.is('varianceChecked', true)
              && valuer.set('variance', randomPeriod());

              state.is('individualDiseaseChanceChecked', true)
              && valuer.set('individualDiseaseChance', randomIndividualDiseaseChance());
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
SetDiseaseParameters.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    period: PropTypes.number,
    variance: PropTypes.number,
    individualDiseaseChance: PropTypes.number,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetDiseaseParameters;
