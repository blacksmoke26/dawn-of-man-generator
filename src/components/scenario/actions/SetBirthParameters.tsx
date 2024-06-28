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
import {
  DECREASE_HALFING_POPULATION_MAX,
  DECREASE_HALFING_POPULATION_MIN,
  DECREASE_START_POPULATION_MAX,
  DECREASE_START_POPULATION_MIN,
} from '~/utils/defaults';
import {randomDecreaseHalfingPopulation, randomDecreaseStartPopulation} from '~/utils/random';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSetBirthParameters
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetBirthParameters> {
}

export interface SetBirthParametersActionAttributesProps extends ActionAttributesProps {
  decreaseStartPopulationChecked: boolean;
  decreaseHalfingPopulationChecked: boolean;
}

const ACTION_NAME: ActionName = 'SetBirthParameters';

const SetBirthParameters = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetBirthParameters>>(
    merge(defaultsParams?.setBirthParameters || {}, props?.initialValues || {}),
  );

  const state = useValues<SetBirthParametersActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    decreaseStartPopulationChecked: !valuer.is('decreaseStartPopulation', undefined),
    decreaseHalfingPopulationChecked: !valuer.is('decreaseHalfingPopulation', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.decreaseStartPopulationChecked) {
      changeValues.decreaseStartPopulation = undefined;
    }

    if (!state.data.decreaseHalfingPopulationChecked) {
      changeValues.decreaseHalfingPopulation = undefined;
    }

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.decreaseStartPopulationChecked,
    state.data.decreaseHalfingPopulationChecked,
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
                caption={<>Decrease start <i className="text-size-xxs text-muted">(population)</i></>}
                checked={state.get<boolean>('decreaseStartPopulationChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('decreaseStartPopulationChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  maxLength={3}
                  min={DECREASE_START_POPULATION_MIN}
                  max={DECREASE_START_POPULATION_MAX}
                  disabled={isDisabled || !state.data.decreaseStartPopulationChecked}
                  placeholder="e.g. 50"
                  value={valuer.get('decreaseStartPopulation', 30)}
                  onChange={value => valuer.set('decreaseStartPopulation', value)}
                  shuffle
                  onShuffle={() => valuer.set('decreaseStartPopulation', randomDecreaseStartPopulation())}
                  allowRestore
                  onRestore={() => valuer.set('decreaseStartPopulation', defaultsParams.setBirthParameters?.decreaseStartPopulation)}
                />
              </Col>
            </Row>
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption={<>Decrease halfing <i className="text-size-xxs text-muted">(population)</i></>}
                checked={state.get<boolean>('decreaseHalfingPopulationChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('decreaseHalfingPopulationChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  maxLength={3}
                  min={DECREASE_HALFING_POPULATION_MIN}
                  max={DECREASE_HALFING_POPULATION_MAX}
                  disabled={isDisabled || !state.data.decreaseHalfingPopulationChecked}
                  placeholder="e.g. 30"
                  value={valuer.get('decreaseHalfingPopulation', 30)}
                  onChange={value => valuer.set('decreaseHalfingPopulation', value)}
                  shuffle
                  onShuffle={() => valuer.set('decreaseHalfingPopulation', randomDecreaseHalfingPopulation())}
                  allowRestore
                  onRestore={() => valuer.set('decreaseHalfingPopulation', defaultsParams.setBirthParameters?.decreaseHalfingPopulation)}
                />
              </Col>
            </Row>
          </Accordion>

          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
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
SetBirthParameters.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    decreaseStartPopulation: PropTypes.number,
    decreaseHalfingPopulation: PropTypes.number,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetBirthParameters;
