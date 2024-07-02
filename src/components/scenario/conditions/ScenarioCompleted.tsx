/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import merge from 'deepmerge';
import {Col, Row} from 'react-bootstrap';

// elemental components
import Accordion from '~/components/ui/Accordion';
import TextInput from '~/components/ui/TextInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import ConditionHeader from './../elements/ConditionHeader';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {defaultsParams, GAME_MODES} from '~/utils/condition';
import {subConditionDefaultProps} from './utils/condition-logical';
import {filterEmpty, toConditionTemplate} from '~/utils/parser/templates';

// types
import type {ConditionScenarioCompleted, ConditionProps, ConditionAttributesProps} from '~/types/condition.types';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';
import uniqueRandomArray from 'unique-random-array';
import {capitalCase} from 'change-case';

interface Props extends ConditionProps<ConditionScenarioCompleted> {
}

export interface ScenarioCompletedAttributes extends ConditionAttributesProps {
  gameModeChecked: boolean;
}

const CONDITION_NAME: string = 'ScenarioCompleted';

const ScenarioCompleted = (props: Props) => {
  const newProps = merge<Required<Props>>(subConditionDefaultProps, props);

  const valuer = useValues<Partial<ConditionScenarioCompleted>>(
    merge(defaultsParams?.scenarioCompleted || {}, props?.initialValues || {}),
  );

  const state = useValues<ScenarioCompletedAttributes>({
    enabled: newProps.enabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    gameModeChecked: !valuer.is('gameMode', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    if (!state.data.gameModeChecked) {
      changeValues.gameMode = undefined;
    }

    newProps?.onTemplate(toConditionTemplate('ScenarioCompleted', changeValues, !state.data.enabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data.enabled, valuer.data, state.data.gameModeChecked]);

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
          <Row className="mb-2 mt-2">
            <PropertyLabel caption="ID"/>
            <Col xs="6">
              <TextInput
                selectOnLoad={true}
                focusOnLoad={true}
                caseType="SNAKE_CASE"
                maxLength={80}
                disabled={isDisabled}
                value={valuer.data.id}
                placeholder="e.g., the_shepherds_herd"
                onChange={value => valuer.set('id', value)}/>
            </Col>
          </Row>
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mb-1 mt-2">
              <PropertyCheckboxLabel
                caption="Game mode"
                checked={state.get<boolean>('gameModeChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'gameMode', 'Normal']}
                onChange={isChecked => state.set('gameModeChecked', isChecked)}
              />
              <AttributeSelect
                className="w-75"
                colProps={{sm: 6}}
                disabled={isDisabled || !state.data.gameModeChecked}
                options={GAME_MODES.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('gameMode', 'Normal')}
                onSelect={option => valuer.set('gameMode', option.value)}
                allowShuffle
                onShuffle={() => valuer.set('gameMode', uniqueRandomArray(GAME_MODES))}
              />
            </Row>
          </Accordion>
        </>
      )}
    </div>
  );
};

// Properties validation
ScenarioCompleted.propTypes = {
  /*enabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  id: PropTypes.string,
  gameMode: PropTypes.bool,
  onChange: PropTypes.func,*/
};

export default ScenarioCompleted;
