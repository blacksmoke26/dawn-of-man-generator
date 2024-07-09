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
import uniqueRandomArray from 'unique-random-array';

// elemental components
import TextInput from '~/components/ui/TextInput';
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import SuggestionInput from '~/components/ui/SuggestionInput';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';
import AttributeSelect, {Option} from '~/components/ui/elements/AttributeSelect';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {randomPosition} from '~/utils/location';
import {actionDefaultProps} from './utils/default';
import {ENTITIES, ENTITIES_OPTIONS} from '~/utils/entities';
import {ENTITY_COUNT_MAX, ENTITY_COUNT_MIN} from '~/utils/condition';
import {randomAngleSingle, randomEntityCount, randomRadius, randomYearsOld} from '~/utils/random';
import {
  defaultsParams,
  AGE_TYPES, BEHAVIOUR_TYPES,
  GENDER_TYPES, PLACEMENT_TYPES,
  PLACEMENT_TYPES_OPTIONS, SPAWN_TYPES,
} from '~/utils/action';
import {
  ANGLE_MIN, ANGLE_MAX,
  POSITION_MIN, POSITION_MAX,
  RADIUS_MIN, RADIUS_MAX,
  YEARS_OLD_MIN, YEARS_OLD_MAX,
} from '~/utils/defaults';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {
  ActionAttributesProps, ActionName, ActionProps, ActionSpawn
} from '~/types/action.types';
import {toInteger} from '~/helpers/number';

export interface Props extends ActionProps<ActionSpawn> {
}

export interface SpawnActionAttributesProps extends ActionAttributesProps {
  angleChecked: boolean;
  radiusChecked: boolean;
  ageChecked: boolean;
  yearsOldChecked: boolean;
  genderChecked: boolean;
  nameChecked: boolean;
  positionChecked: boolean;
  spawnTypeChecked: boolean;
  behaviourChecked: boolean;
}

const ACTION_NAME: ActionName = 'Spawn';

const Spawn = (props: Props) => {
  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSpawn>>(
    merge(defaultsParams?.spawn || {}, props?.initialValues || {}),
  );

  const state = useValues<SpawnActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    angleChecked: !valuer.is('angle', undefined),
    radiusChecked: !valuer.is('radius', undefined),
    ageChecked: !valuer.is('age', undefined),
    yearsOldChecked: !valuer.is('yearsOld', undefined),
    genderChecked: !valuer.is('gender', undefined),
    nameChecked: !valuer.is('name', [undefined, '']),
    positionChecked: !valuer.is('position', undefined),
    spawnTypeChecked: !valuer.is('spawnType', undefined),
    behaviourChecked: !valuer.is('behaviour', undefined),
  });

  // Reflect values changes
  React.useEffect(() => {
    const changeValues = {...valuer.data};
    changeValues.amount = toInteger(changeValues.amount);

    !state.data.angleChecked && (changeValues.angle = undefined);
    !state.data.radiusChecked && (changeValues.radius = undefined);
    !state.data.ageChecked && (changeValues.age = undefined);
    !state.data.yearsOldChecked && (changeValues.yearsOld = undefined);
    !state.data.nameChecked && (changeValues.name = undefined);
    !state.data.positionChecked && (changeValues.position = undefined);
    !state.data.spawnTypeChecked && (changeValues.spawnType = undefined);
    !state.data.behaviourChecked && (changeValues.behaviour = undefined);

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changeValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changeValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.angleChecked,
    state.data.radiusChecked,
    state.data.ageChecked,
    state.data.yearsOldChecked,
    state.data.nameChecked,
    state.data.positionChecked,
    state.data.spawnTypeChecked,
    state.data.behaviourChecked,
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
    <div className={cn('mb-3', {'text-muted': isDisabled}, 'checkbox-align')}>
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
          <Row className="mt-2">
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
          <Row className="mt-2">
            <PropertyLabel caption="Placement"/>
            <Col sm="5">
              <SuggestionInput
                disabled={isDisabled}
                caseType="PASCAL"
                placeholder="e.g., StartLocationCircular"
                options={PLACEMENT_TYPES_OPTIONS}
                value={valuer.get('placement', 'StartLocationCircular')}
                onChange={value => valuer.set('placement', value)}
                allowShuffle={true}
                onShuffle={() => {
                  valuer.set('placement', uniqueRandomArray(PLACEMENT_TYPES));
                }}
              />
            </Col>
          </Row>
          <Row className="mb-2 mt-2">
            <PropertyLabel caption="Amount"/>
            <Col sm="4">
              <NumberInput
                maxLength={3}
                min={ENTITY_COUNT_MIN}
                max={ENTITY_COUNT_MAX}
                disabled={isDisabled}
                placeholder="e.g. 10"
                value={valuer.get('amount', 1)}
                onChange={value => valuer.set('amount', value)}
                shuffle
                onShuffle={() => valuer.set('amount', randomEntityCount())}
                allowRestore
                onRestore={() => valuer.set('amount', 1)}
              />
            </Col>
          </Row>
          <Accordion
            noBodyPad={true}
            noCard={true}
            header="Optional parameters"
            eventKey="optional_parameters">
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Position"
                checked={state.data.positionChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'position', [0, 0]]}
                onChange={isChecked => state.set('positionChecked', isChecked)}
              />
              <AttributeRangeValue
                colProps={{sm: '6'}}
                disabled={isDisabled || !state.data.positionChecked}
                min={valuer.get('position.0', 0)}
                max={valuer.get('position.1', 0)}
                sliderProps={{min: POSITION_MIN, max: POSITION_MAX}}
                allowRestore
                onRestore={() => valuer.overwrite('position', [0, 0])}
                allowShuffle
                onShuffle={() => {
                  valuer.overwrite('position', randomPosition());
                }}
                onChange={(min, max) => {
                  valuer.overwrite('position', [min, max]);
                }}
              />
            </Row>
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Angle"
                checked={state.data.angleChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'angle', 60]}
                onChange={isChecked => state.set('angleChecked', isChecked)}
              />
              <Col sm="4">
                <NumberInput
                  decimals={1}
                  maxLength={3}
                  min={ANGLE_MIN}
                  max={ANGLE_MAX}
                  disabled={isDisabled || !state.data.angleChecked}
                  placeholder="e.g. 30"
                  value={valuer.get('angle', 60)}
                  onChange={value => valuer.set('angle', +value)}
                  shuffle
                  onShuffle={() => valuer.set('angle', randomAngleSingle())}
                  allowRestore
                  onRestore={() => valuer.set('angle', 60)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Radius"
                checked={state.get<boolean>('radiusChecked', false)}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'radius', 30]}
                onChange={isChecked => {
                  state.set('radiusChecked', isChecked);
                }}
              />
              <Col sm="4">
                <NumberInput
                  decimals={1}
                  maxLength={3}
                  min={RADIUS_MIN}
                  max={RADIUS_MAX}
                  disabled={isDisabled || !state.data.radiusChecked}
                  placeholder="e.g. 30"
                  value={valuer.get('radius', 30)}
                  onChange={value => valuer.set('radius', +value)}
                  shuffle
                  onShuffle={() => valuer.set('radius', randomRadius())}
                  allowRestore
                  onRestore={() => valuer.set('radius', 30)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Age"
                checked={state.data.ageChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'age', 'Young']}
                onChange={isChecked => state.set('ageChecked', isChecked)}
              />
              <AttributeSelect
                disabled={isDisabled || !state.data.ageChecked}
                options={AGE_TYPES.map((value: string) => ({label: value, value}))}
                value={valuer.get('age', 'Young')}
                onSelect={option => valuer.set('age', option.value)}
                allowShuffle={true}
                onShuffle={() => {
                  valuer.set('age', uniqueRandomArray(AGE_TYPES));
                }}
              />
            </Row>
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Years old"
                checked={state.data.yearsOldChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'yearsOld', 10]}
                onChange={isChecked => state.set('yearsOldChecked', isChecked)}
              />
              <Col sm="4">
                <NumberInput
                  maxLength={2}
                  min={YEARS_OLD_MIN}
                  max={YEARS_OLD_MAX}
                  disabled={isDisabled || !state.data.yearsOldChecked}
                  placeholder="e.g. 10"
                  value={valuer.get('yearsOld', 10)}
                  onChange={value => valuer.set('yearsOld', +value)}
                  shuffle
                  onShuffle={() => valuer.set('yearsOld', randomYearsOld())}
                  allowRestore
                  onRestore={() => valuer.set('yearsOld', 10)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Gender"
                checked={state.data.genderChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'gender', 'Male']}
                onChange={isChecked => state.set('genderChecked', isChecked)}
              />
              <AttributeSelect
                disabled={isDisabled || !state.data.genderChecked}
                options={GENDER_TYPES.map((value: string) => ({label: value, value}))}
                value={valuer.get('gender', 'Male')}
                onSelect={option => valuer.set('gender', option.value)}
                allowShuffle={true}
                onShuffle={() => {
                  valuer.set('gender', uniqueRandomArray(GENDER_TYPES));
                }}
              />
            </Row>
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Name"
                checked={state.data.nameChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'name', '']}
                onChange={isChecked => state.set('nameChecked', isChecked)}
              />
              <Col sm="4">
                <TextInput
                  value={valuer.get('name', '')}
                  disabled={isDisabled || !state.data.nameChecked}
                  placeholder="e.g., swana"
                  caseType="SNAKE_CASE"
                  onChange={value => valuer.set('name', value)}/>
              </Col>
            </Row>
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Spawn type"
                checked={state.data.spawnTypeChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'spawnType', 'Auto']}
                onChange={isChecked => state.set('spawnTypeChecked', isChecked)}
              />
              <AttributeSelect
                disabled={isDisabled || !state.data.spawnTypeChecked}
                options={SPAWN_TYPES.map((value: string) => ({label: value, value}))}
                value={valuer.get('spawnType', 'Auto')}
                onSelect={option => valuer.set('spawnType', option.value)}
                allowShuffle={true}
                onShuffle={() => {
                  valuer.set('spawnType', uniqueRandomArray(SPAWN_TYPES));
                }}
                allowRestore
                onRestore={() => valuer.set('spawnType', 'Auto')}
              />
            </Row>
            <Row className="mt-2">
              <PropertyCheckboxLabel
                caption="Behaviour"
                checked={state.data.behaviourChecked}
                disabled={isDisabled}
                undefinedSetter={[valuer, 'behaviour', 'None']}
                onChange={isChecked => state.set('behaviourChecked', isChecked)}
              />
              <AttributeSelect
                disabled={isDisabled || !state.data.behaviourChecked}
                options={BEHAVIOUR_TYPES.map((value: string) => ({label: value, value}))}
                value={valuer.get('behaviour', 'None')}
                onSelect={option => valuer.set('behaviour', option.value)}
                allowShuffle={true}
                onShuffle={() => {
                  valuer.set('behaviour', uniqueRandomArray(BEHAVIOUR_TYPES));
                }}
                allowRestore
                onRestore={() => valuer.set('behaviour', 'None')}
              />
            </Row>
          </Accordion>
        </>
      )}
    </div>
  );
};

// Properties validation
Spawn.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    entityType: PropTypes.oneOf(ENTITIES),
    placement: PropTypes.oneOfType([
      PropTypes.oneOf(PLACEMENT_TYPES), PropTypes.string
    ]),
    amount: PropTypes.number,
    angle: PropTypes.number,
    radius: PropTypes.number,
    age: PropTypes.oneOf(AGE_TYPES),
    yearsOld: PropTypes.number,
    gender: PropTypes.oneOf(GENDER_TYPES),
    name: PropTypes.string,
    position: PropTypes.arrayOf(PropTypes.number),
    spawnType: PropTypes.oneOf(SPAWN_TYPES),
    behaviour: PropTypes.oneOf(BEHAVIOUR_TYPES),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default Spawn;
