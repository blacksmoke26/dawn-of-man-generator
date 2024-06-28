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
import {capitalCase} from 'change-case';
import {Col, Row} from 'react-bootstrap';
import uniqueRandomArray from 'unique-random-array';

// elemental components
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import TextInput from '~/components/ui/TextInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import AttributeSelect, {Option} from '~/components/ui/elements/AttributeSelect';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {actionDefaultProps} from './utils/default';
import {ENTITIES, ENTITIES_OPTIONS} from '~/utils/entities';
import {DANGER_LEVEL_TYPES, defaultsParams, MARKER_TYPES, UI_CONTEXT_ACTIONS} from '~/utils/action';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSetUiMarker
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetUiMarker> {
}

export interface SetUiMarkerActionAttributesProps extends ActionAttributesProps {
  markerTypeChecked: boolean;
  excludedGoalChecked: boolean;
  requiredGoalChecked: boolean;
  maxDangerLevelChecked: boolean;
}

const ACTION_NAME: ActionName = 'SetUiMarker';

const SetUiMarker = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetUiMarker>>(
    merge(defaultsParams?.setUiMarker || {}, props?.initialValues || {}),
  );

  const state = useValues<SetUiMarkerActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    markerTypeChecked: !valuer.is('markerType', undefined),
    excludedGoalChecked: !valuer.is('excludedGoal', undefined),
    requiredGoalChecked: !valuer.is('requiredGoal', undefined),
    maxDangerLevelChecked: !valuer.is('maxDangerLevel', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.markerTypeChecked && (changeValues.markerType = undefined);
    !state.data.excludedGoalChecked && (changeValues.excludedGoal = undefined);
    !state.data.requiredGoalChecked && (changeValues.requiredGoal = undefined);
    !state.data.maxDangerLevelChecked && (changeValues.maxDangerLevel = undefined);

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.markerTypeChecked,
    state.data.excludedGoalChecked,
    state.data.requiredGoalChecked,
    state.data.maxDangerLevelChecked,
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
        <>
          <Row className="mb-3 mt-2">
            <PropertyLabel caption="Work area ID"/>
            <Col sm="4">
              <TextInput
                selectOnLoad
                focusOnLoad
                value={valuer.get('workAreaId', '')}
                disabled={isDisabled}
                placeholder="e.g., mountain_side"
                caseType="SNAKE_CASE"
                allowClear
                onChange={value => valuer.set('workAreaId', value)}/>
            </Col>
          </Row>
          <Row className="mb-1 mt-3">
            <PropertyLabel caption="Context action"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: '6'}}
              disabled={isDisabled}
              options={UI_CONTEXT_ACTIONS.map((value: string) => ({label: capitalCase(value), value}))}
              value={valuer.get('contextAction', null)}
              onSelect={option => valuer.set('contextAction', option.value)}
              allowShuffle
              onShuffle={() => {
                valuer.set('contextAction', uniqueRandomArray(UI_CONTEXT_ACTIONS));
              }}
            />
          </Row>
          <Row className="mb-3 mt-3">
            <PropertyLabel caption="Entity type"/>
            <AttributeSelect
              className="w-75"
              colProps={{sm: '8'}}
              disabled={isDisabled}
              options={ENTITIES_OPTIONS as unknown as Option[]}
              value={valuer.get('entityType', 'primitive_human')}
              onSelect={option => valuer.set('entityType', option.value)}
              allowShuffle
              onShuffle={() => {
                valuer.set('entityType', uniqueRandomArray(ENTITIES));
              }}
              allowClear
              onClear={() => valuer.set('entityType', [])}
            />
          </Row>

          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mb-2 mt-3">
              <PropertyCheckboxLabel
                caption="Marker type"
                checked={state.data.markerTypeChecked}
                disabled={isDisabled}
                onChange={isChecked => state.set('markerTypeChecked', isChecked)}
              />
              <AttributeSelect
                disabled={isDisabled || !state.data.markerTypeChecked}
                options={MARKER_TYPES.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('markerType', 'Build')}
                onSelect={option => valuer.set('markerType', option.value)}
                allowShuffle={true}
                onShuffle={() => {
                  valuer.set('markerType', uniqueRandomArray(MARKER_TYPES));
                }}
              />
            </Row>
            <Row className="mb-2 mt-3">
              <PropertyCheckboxLabel
                caption="Excluded goal"
                checked={state.data.excludedGoalChecked}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('excludedGoalChecked', isChecked);
                }}
              />
              <Col sm="4">
                <TextInput
                  selectOnLoad
                  focusOnLoad
                  value={valuer.get('excludedGoal', '')}
                  disabled={isDisabled || !state.data.excludedGoalChecked}
                  placeholder="e.g., spawn_swords"
                  caseType="SNAKE_CASE"
                  allowClear
                  onChange={value => valuer.set('excludedGoal', value)}/>
              </Col>
            </Row>
            <Row className="mb-2 mt-3">
              <PropertyCheckboxLabel
                caption="Required goal"
                checked={state.data.requiredGoalChecked}
                disabled={isDisabled}
                onChange={isChecked => state.set('requiredGoalChecked', isChecked)}
              />
              <Col sm="4">
                <TextInput
                  selectOnLoad
                  focusOnLoad
                  value={valuer.get('requiredGoal', '')}
                  disabled={isDisabled || !state.data.requiredGoalChecked}
                  placeholder="e.g., timedspawn"
                  caseType="SNAKE_CASE"
                  allowClear
                  onChange={value => valuer.set('requiredGoal', value)}/>
              </Col>
            </Row>
            <Row className="mb-1 mt-3">
              <PropertyCheckboxLabel
                caption={<>Danger level <i className="text-size-xxs text-muted">(max)</i></>}
                checked={state.data.maxDangerLevelChecked}
                disabled={isDisabled}
                onChange={isChecked => state.set('maxDangerLevelChecked', isChecked)}
              />
              <AttributeSelect
                className="w-75"
                colProps={{sm: '6'}}
                disabled={isDisabled || !state.data.maxDangerLevelChecked}
                options={DANGER_LEVEL_TYPES.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('maxDangerLevel', 'VeryHigh')}
                onSelect={option => valuer.set('maxDangerLevel', option.value)}
                allowShuffle
                onShuffle={() => {
                  valuer.set('maxDangerLevel', uniqueRandomArray(DANGER_LEVEL_TYPES));
                }}
              />
            </Row>
          </Accordion>

          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
              state.data.markerTypeChecked
              && valuer.set('markerType', uniqueRandomArray(MARKER_TYPES));
              valuer.set('entityType', uniqueRandomArray(ENTITIES));

              valuer.set('contextAction', uniqueRandomArray(UI_CONTEXT_ACTIONS));
              state.data.maxDangerLevelChecked
              && valuer.set('maxDangerLevel', uniqueRandomArray(DANGER_LEVEL_TYPES));
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
SetUiMarker.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    markerType: PropTypes.oneOf(MARKER_TYPES),
    entityType: PropTypes.oneOf(ENTITIES),
    contextAction: PropTypes.oneOf(UI_CONTEXT_ACTIONS),
    workAreaId: PropTypes.string,
    excludedGoal: PropTypes.string,
    requiredGoal: PropTypes.string,
    maxDangerLevel: PropTypes.oneOf(DANGER_LEVEL_TYPES),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetUiMarker;
