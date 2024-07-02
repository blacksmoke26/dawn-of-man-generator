// noinspection HtmlUnknownAttribute

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {Row} from 'react-bootstrap';
import {capitalCase} from 'change-case';
import uniqueRandomArray from 'unique-random-array';

// elemental components
import Accordion from '~/components/ui/Accordion';
import ConditionHeader from './../elements/ConditionHeader';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';
import {defaultsParams, INTERACTIONS} from '~/utils/condition';

// types
import type {ConditionAttributesProps, ConditionIsGameInteractionPending, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionIsGameInteractionPending> {
}

export interface IsGameInteractionPendingAttributes extends ConditionAttributesProps {
  valueChecked: boolean;
}

const CONDITION_NAME: string = 'IsGameInteractionPending';

const IsGameInteractionPending = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionIsGameInteractionPending>>(
    merge(defaultsParams?.isGameInteractionPending || {}, props?.initialValues || {}),
  );

  const state = useValues<IsGameInteractionPendingAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    valueChecked: !valuer.is('value', undefined),
  });

  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.valueChecked && (changeValues.value = undefined);

    newProps?.onTemplate(toConditionTemplate('IsGameInteractionPending', changeValues, !state.data.enabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.enabled, valuer.data,
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
          <div style={{height: 5}}>&nbsp;</div>
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mb-1 mt-2">
              <PropertyCheckboxLabel
                caption="Value"
                checked={state.get<boolean>('valueChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'value', 'None']}
                onChange={isChecked => state.set('valueChecked', isChecked)}
              />
              <AttributeSelect
                className="w-75"
                colProps={{sm: 6}}
                disabled={isDisabled || !state.data.valueChecked}
                options={INTERACTIONS.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('value', 'None')}
                onSelect={option => valuer.set('value', option.value)}
                allowShuffle
                onShuffle={() => valuer.set('value', uniqueRandomArray(INTERACTIONS))}
              />
            </Row>
          </Accordion>
        </>
      )}
    </div>
  );
};

// Properties validation
IsGameInteractionPending.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  counter: PropTypes.oneOf(COUNTERS),
  entityType: PropTypes.oneOf(INTERACTIONS),
  value: PropTypes.number,*/
};

export default IsGameInteractionPending;
