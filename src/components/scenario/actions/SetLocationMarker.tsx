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
import TextInput from '~/components/ui/TextInput';
import ActionHeader from './elements/ActionHeader';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';
import AttributeSelect, {Option} from '~/components/ui/elements/AttributeSelect';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {randomScale} from '~/utils/random';
import {randomPosition} from '~/utils/location';
import {actionDefaultProps} from './utils/default';
import {ENTITIES, ENTITIES_OPTIONS} from '~/utils/entities';
import {defaultsParams, MARKER_TYPES, REF_POSITIONS} from '~/utils/action';
import {POSITION_MAX, POSITION_MIN, SCALE_MAX, SCALE_MIN} from '~/utils/defaults';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSetLocationMarker
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetLocationMarker> {
}

export interface SetLocationMarkerActionAttributesProps extends ActionAttributesProps {
  markerTypeChecked: boolean;
  requiredGoalChecked: boolean;
  excludedGoalChecked: boolean;
  positionChecked: boolean;
  scaleChecked: boolean;
  refPositionChecked: boolean;
}

const ACTION_NAME: ActionName = 'SetLocationMarker';

const SetLocationMarker = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetLocationMarker>>(
    merge(defaultsParams?.setLocationMarker || {}, props?.initialValues || {}),
  );

  const state = useValues<SetLocationMarkerActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    markerTypeChecked: !valuer.is('markerType', undefined),
    requiredGoalChecked: !valuer.is('requiredGoal', undefined),
    excludedGoalChecked: !valuer.is('excludedGoal', undefined),
    positionChecked: !valuer.is('position', undefined),
    scaleChecked: !valuer.is('scale', undefined),
    refPositionChecked: !valuer.is('refPosition', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};

    !state.data.markerTypeChecked && (changeValues.markerType = undefined);
    !state.data.requiredGoalChecked && (changeValues.requiredGoal = undefined);
    !state.data.excludedGoalChecked && (changeValues.excludedGoal = undefined);
    !state.data.positionChecked && (changeValues.position = undefined);
    !state.data.scaleChecked && (changeValues.scale = undefined);
    !state.data.refPositionChecked && (changeValues.refPosition = undefined);

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled,
    state.data.markerTypeChecked,
    state.data.requiredGoalChecked,
    state.data.excludedGoalChecked,
    state.data.positionChecked,
    state.data.scaleChecked,
    state.data.refPositionChecked,
    valuer.data,
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
          <Row className="mb-3 mt-2">
            <PropertyLabel caption="Entity type"/>
            <AttributeSelect
              disabled={isDisabled}
              options={ENTITIES_OPTIONS as unknown as Option[]}
              value={valuer.get('entityType', 'primitive_human')}
              onSelect={option => valuer.set('entityType', option.value)}
              allowShuffle={true}
              onShuffle={() => {
                valuer.set('entityType', uniqueRandomArray(ENTITIES));
              }}
            />
          </Row>

          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mb-3 mt-2">
              <PropertyCheckboxLabel
                caption="Marker type"
                checked={state.get<boolean>('markerTypeChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('markerTypeChecked', isChecked);
                }}
              />
              <AttributeSelect
                disabled={isDisabled || !state.get<boolean>('markerTypeChecked', false)}
                options={MARKER_TYPES.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('markerType', 'NearestBank')}
                onSelect={option => valuer.set('markerType', option.value)}
                allowShuffle={true}
                onShuffle={() => {
                  valuer.set('markerType', uniqueRandomArray(MARKER_TYPES));
                }}
              />
            </Row>
            <Row className="mb-3 mt-2">
              <PropertyCheckboxLabel
                caption="Required goal"
                checked={state.get<boolean>('requiredGoalChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('requiredGoalChecked', isChecked);
                }}
              />
              <Col sm="4">
                <TextInput
                  selectOnLoad
                  focusOnLoad
                  value={valuer.get('requiredGoal', '')}
                  disabled={isDisabled || !state.get<boolean>('requiredGoalChecked', false)}
                  placeholder="e.g., timedspawn"
                  caseType="SNAKE_CASE"
                  allowClear
                  onChange={value => valuer.set('requiredGoal', value)}/>
              </Col>
            </Row>
            <Row className="mb-3 mt-2">
              <PropertyCheckboxLabel
                caption="Excluded goal"
                checked={state.get<boolean>('excludedGoalChecked', false)}
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
                  disabled={isDisabled || !state.get<boolean>('excludedGoalChecked', false)}
                  placeholder="e.g., spawn_swords"
                  caseType="SNAKE_CASE"
                  allowClear
                  onChange={value => valuer.set('excludedGoal', value)}/>
              </Col>
            </Row>
            <Row className="mb-3 mt-2">
              <PropertyCheckboxLabel
                caption="Position"
                checked={state.get<boolean>('positionChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('positionChecked', isChecked);
                }}
              />
              <Col sm="10">
                <AttributeRangeValue
                  colProps={{sm: 6}}
                  disabled={isDisabled || !state.get<boolean>('positionChecked', false)}
                  min={valuer.get('position.0', 0)}
                  max={valuer.get('position.1', 0)}
                  sliderProps={{min: POSITION_MIN, max: POSITION_MAX}}
                  allowRestore
                  onRestore={(excludeMin, excludeMax) => {
                    valuer.overwrite('position', [0, 0]);
                  }}
                  allowShuffle
                  onShuffle={() => {
                    valuer.overwrite('position', randomPosition());
                  }}
                  onChange={(min, max) => {
                    valuer.overwrite('position', [min, max]);
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3 mt-2">
              <PropertyCheckboxLabel
                caption="Scale"
                checked={state.get<boolean>('scaleChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('scaleChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  maxLength={3}
                  decimals={1}
                  min={SCALE_MIN}
                  max={SCALE_MAX}
                  disabled={isDisabled || !state.get<boolean>('scaleChecked', false)}
                  placeholder="e.g. 10"
                  value={valuer.get('scale', 4)}
                  onChange={value => valuer.set('scale', value)}
                  allowRestore
                  onRestore={() => valuer.set('scale', 10)}
                  shuffle
                  onShuffle={() => valuer.set('scale', randomScale())}
                />
              </Col>
            </Row>
            <Row className="mb-3 mt-2">
              <PropertyCheckboxLabel
                caption="Ref position"
                checked={state.get<boolean>('refPositionChecked', false)}
                disabled={isDisabled}
                onChange={isChecked => {
                  state.set('refPositionChecked', isChecked);
                }}
              />
              <AttributeSelect
                disabled={isDisabled || !state.get<boolean>('refPositionChecked', false)}
                options={REF_POSITIONS.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('refPosition', 'Settlement')}
                onSelect={option => valuer.set('refPosition', option.value)}
                allowShuffle={true}
                onShuffle={() => {
                  valuer.set('refPosition', uniqueRandomArray(REF_POSITIONS));
                }}
              />
            </Row>
          </Accordion>
          <RandomizeValuesButton
            disabled={isDisabled}
            onClick={() => {
              state.is('markerTypeChecked', true) && valuer.set('markerType', uniqueRandomArray(MARKER_TYPES));
              valuer.set('entityType', uniqueRandomArray(ENTITIES));

              if (state.is('positionChecked', true)) {
                valuer.overwrite('position', randomPosition());
              }
              state.is('scaleChecked', true) && valuer.set('scale', randomScale());
              state.is('refPositionChecked', true)
              && valuer.set('refPosition', uniqueRandomArray(REF_POSITIONS));
            }}
          />
        </>
      )}
    </div>
  );
};

// Properties validation
SetLocationMarker.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    markerType: PropTypes.oneOf(MARKER_TYPES),
    entityType: PropTypes.oneOf(ENTITIES),
    requiredGoal: PropTypes.string,
    excludedGoal: PropTypes.string,
    workAreaId: PropTypes.string,
    position: PropTypes.arrayOf(PropTypes.number),
    scale: PropTypes.number,
    refPosition: PropTypes.oneOf(REF_POSITIONS),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetLocationMarker;
