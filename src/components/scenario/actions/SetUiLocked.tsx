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
import {Row} from 'react-bootstrap';
import {capitalCase} from 'change-case';
import uniqueRandomArray from 'unique-random-array';

// elemental components
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {actionDefaultProps} from './utils/default';
import {defaultsParams, LOCK_FLAGS} from '~/utils/action';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSetUiLocked
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetUiLocked> {
}

export interface SetUiLockedActionAttributesProps extends ActionAttributesProps {
  lockFlagsChecked: boolean;
}

const ACTION_NAME: ActionName = 'SetUiLocked';

const SetUiLocked = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetUiLocked>>(
    merge(defaultsParams?.setUiLocked || {}, props?.initialValues || {}),
  );

  const state = useValues<SetUiLockedActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    lockFlagsChecked: !valuer.is('lockFlags', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.lockFlagsChecked) {
      changeValues.lockFlags = undefined;
    }

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, state.data.lockFlagsChecked,
    valuer.data,
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
          <Row className="mb-1 mt-3">
            <PropertyCheckboxLabel
              caption="Lock flags"
              checked={state.data.lockFlagsChecked}
              disabled={isDisabled}
              undefinedSetter={[valuer, 'lockFlags', 'None']}
              onChange={isChecked => state.set('lockFlagsChecked', isChecked)}
            />
            <AttributeSelect
              className="w-75"
              colProps={{sm: '6'}}
              disabled={isDisabled || !state.data.lockFlagsChecked}
              options={LOCK_FLAGS.map(value => ({label: capitalCase(value), value}))}
              value={valuer.get('lockFlags', 'None')}
              onSelect={option => valuer.set('lockFlags', option.value)}
              allowShuffle
              onShuffle={() => {
                valuer.set('lockFlags', uniqueRandomArray(LOCK_FLAGS));
              }}
            />
          </Row>
        </Accordion>
      )}
    </div>
  );
};

// Properties validation
SetUiLocked.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    lockFlags: PropTypes.oneOf(LOCK_FLAGS),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetUiLocked;
