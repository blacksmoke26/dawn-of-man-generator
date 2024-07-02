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
import {defaultsParams, START_MODES} from '~/utils/condition';

// types
import type {ConditionAttributesProps, ConditionNewGame, ConditionProps} from '~/types/condition.types';

interface Props extends ConditionProps<ConditionNewGame> {
}

export interface NewGameAttributes extends ConditionAttributesProps {
  startModeChecked: boolean;
}

const CONDITION_NAME: string = 'NewGame';

const NewGame = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionNewGame>>(
    merge(defaultsParams?.newGame || {}, props?.initialValues || {}),
  );

  const state = useValues<NewGameAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    startModeChecked: !valuer.is('startMode', undefined),
  });

  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.startModeChecked && (changeValues.startMode = undefined);

    newProps?.onTemplate(toConditionTemplate('NewGame', changeValues, !state.data.enabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.enabled, valuer.data,
    state.data.startModeChecked,
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
                checked={state.get<boolean>('startModeChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'startMode', 'Settled']}
                onChange={isChecked => state.set('startModeChecked', isChecked)}
              />
              <AttributeSelect
                className="w-75"
                colProps={{sm: 6}}
                disabled={isDisabled || !state.data.startModeChecked}
                options={START_MODES.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('startMode', 'Settled')}
                onSelect={option => valuer.set('startMode', option.value)}
                allowShuffle
                onShuffle={() => valuer.set('startMode', uniqueRandomArray(START_MODES))}
              />
            </Row>
          </Accordion>
        </>
      )}
    </div>
  );
};

// Properties validation
NewGame.propTypes = {
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

export default NewGame;
