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
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {defaultsParams} from '~/utils/action';
import {randomPeriod} from '~/utils/random';
import {actionDefaultProps} from './utils/default';
import {PERIOD_MAX, PERIOD_MIN} from '~/utils/defaults';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSetTraderPeriod
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetTraderPeriod> {
}

export interface SetTraderPeriodActionAttributesProps extends ActionAttributesProps {
  valueChecked: boolean;
}

const ACTION_NAME: ActionName = 'SetTraderPeriod';

const SetTraderPeriod = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetTraderPeriod>>(
    merge(defaultsParams?.setTraderPeriod || {}, props?.initialValues || {}),
  );

  const state = useValues<SetTraderPeriodActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    valueChecked: !valuer.is('valueChecked', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.valueChecked && (changeValues.value = undefined);

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, state.data.valueChecked, valuer.data,
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
        <Accordion
          noBodyPad={true}
          noCard={true}
          header="Optional parameters"
          eventKey="optional_parameters">
          <Row className="mb-3 mt-2">
            <PropertyCheckboxLabel
              caption="Value"
              checked={state.data.valueChecked}
              disabled={isDisabled}
              undefinedSetter={[valuer, 'value', 0]}
              onChange={isChecked => {
                state.set('valueChecked', isChecked);
              }}
            />
            <Col sm="4">
              <NumberInput
                labelAfter="y"
                maxLength={3}
                decimals={1}
                min={PERIOD_MIN}
                max={PERIOD_MAX}
                disabled={isDisabled || !state.data.valueChecked}
                placeholder="e.g. 1.5"
                value={valuer.get('value', 0)}
                onChange={value => valuer.set('value', value)}
                allowRestore
                onRestore={() => valuer.set('value', 0)}
                shuffle
                onShuffle={() => valuer.set('value', randomPeriod())}
              />
            </Col>
          </Row>
        </Accordion>
      )}
    </div>
  );
};

// Properties validation
SetTraderPeriod.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    value: PropTypes.number,
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetTraderPeriod;
