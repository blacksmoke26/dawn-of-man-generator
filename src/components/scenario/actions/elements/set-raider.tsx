/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-13
 * @version 2.6.0
 */

import React from 'react';
import cn from 'classname';
import {capitalCase} from 'change-case';
import {ButtonGroup, ButtonToolbar, Col, Form, InputGroup, Row} from 'react-bootstrap';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import TagNumberInput from '~/components/ui/TagNumberInput';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';
import AttributeSelect, {Option} from '~/components/ui/elements/AttributeSelect';

// icons
import {IconClear, IconNew} from '~/components/icons/app';

// utils
import {ENTITY_COUNT_MAX, ENTITY_COUNT_MIN} from '~/utils/condition';
import {ENTITIES_LIVING, ENTITIES_LIVING_OPTIONS} from '~/utils/entities';
import {PERIOD_MAX, PERIOD_MIN, WAVES_CREATE_MAX} from '~/utils/defaults';
import {randomArray, randomEntityCount, randomEntityMinMax, randomPeriod} from '~/utils/random';

// types
import type {WavesState} from '../utils/set-raider';
import type {ActionSetRaider} from '~/types/action.types';
import type {UseValuesHook} from '~/hooks/use-values.types';
import type {SetRaiderActionAttributesProps} from '../SetRaider';

export const EntityTypesAttribute = ({valuer, disabled}: {
  valuer: UseValuesHook<ActionSetRaider>;
  disabled: boolean;
}) => (
  <Row className="mt-2">
    <PropertyLabel caption="Entity types"/>
    <AttributeSelect
      className="w-75"
      colProps={{sm: '10'}}
      disabled={disabled}
      options={ENTITIES_LIVING_OPTIONS as unknown as Option[]}
      value={valuer.get<string[]>('entityTypes', [])?.map(value => ({
        label: capitalCase(value),
        value,
      })) || []}
      selectProps={{isSearchable: true, isMulti: true, isClearable: false}}
      onChange={(option, {action}) => {
        if (['select-option', 'remove-value', 'clear'].includes(action) && Array.isArray(option)) {
          valuer.overwrite('entityTypes', option?.map(({value}) => value) || []);
        }
      }}
      allowShuffle
      onShuffle={() => {
        valuer.set('entityTypes', randomArray(ENTITIES_LIVING as string[], 5, true));
      }}
      allowClear
      onClear={() => valuer.set('entityTypes', [])}
    />
  </Row>
);

export const HardcoreTimerAttribute = ({valuer, state, checked, disabled}: {
  checked: boolean;
  valuer: UseValuesHook<ActionSetRaider>;
  state: UseValuesHook<SetRaiderActionAttributesProps>;
  disabled: boolean;
}) => (
  <Row className="mt-2">
    <PropertyCheckboxLabel
      caption="Hardcore timer"
      checked={checked}
      disabled={disabled}
      undefinedSetter={[valuer, 'hardcoreTimer', 10]}
      onChange={isChecked => state.set('hardcoreTimerChecked', isChecked)}
    />
    <Col sm="4">
      <NumberInput
        maxLength={3}
        decimals={1}
        min={PERIOD_MIN}
        max={PERIOD_MAX}
        disabled={disabled}
        placeholder="e.g. 1.5"
        value={valuer.get('hardcoreTimer', 10)}
        onChange={value => valuer.set('hardcoreTimer', value)}
        shuffle
        onShuffle={() => valuer.set('hardcoreTimer', randomPeriod())}
        allowRestore
        onRestore={() => valuer.set('hardcoreTimer', 10)}
      />
    </Col>
  </Row>
);

export const GracePeriodAttribute = ({valuer, state, checked, disabled, inputDisabled}: {
  checked: boolean;
  valuer: UseValuesHook<ActionSetRaider>;
  state: UseValuesHook<SetRaiderActionAttributesProps>;
  disabled: boolean;
  inputDisabled: boolean;
}) => (
  <Row className="mt-2">
    <PropertyCheckboxLabel
      caption="Grace period"
      checked={checked}
      disabled={disabled}
      undefinedSetter={[valuer, 'gracePeriod', 1]}
      onChange={isChecked => state.set('gracePeriodChecked', isChecked)}
    />
    <Col sm="4">
      <NumberInput
        labelAfter="y"
        maxLength={3}
        decimals={1}
        min={PERIOD_MIN}
        max={PERIOD_MAX}
        disabled={inputDisabled}
        placeholder="e.g. 1"
        value={valuer.get('gracePeriod', 1)}
        onChange={value => valuer.set('gracePeriod', value)}
        shuffle
        onShuffle={() => valuer.set('gracePeriod', randomPeriod())}
        allowRestore
        onRestore={() => valuer.set('gracePeriod', 1)}
      />
    </Col>
  </Row>
);

export const ExtraRaidersAttribute = ({valuer, state, checked, disabled, inputDisabled}: {
  checked: boolean;
  valuer: UseValuesHook<ActionSetRaider>;
  state: UseValuesHook<SetRaiderActionAttributesProps>;
  disabled: boolean;
  inputDisabled: boolean;
}) => (
  <Row className="mt-2">
    <PropertyCheckboxLabel
      caption="Extra raiders"
      tooltip="Additional raiders per population"
      checked={checked}
      disabled={disabled}
      undefinedSetter={[valuer, 'extraRaiderPerPopulation', 0]}
      onChange={isChecked => state.set('extraRaiderPerPopulationChecked', isChecked)}
    />
    <Col sm="4">
      <NumberInput
        maxLength={3}
        min={ENTITY_COUNT_MIN}
        max={ENTITY_COUNT_MAX}
        disabled={inputDisabled}
        placeholder="e.g. 1"
        value={valuer.get('extraRaiderPerPopulation', 0)}
        onChange={value => valuer.set('extraRaiderPerPopulation', value)}
        shuffle
        onShuffle={() => valuer.set('extraRaiderPerPopulation', randomEntityCount())}
        allowRestore
        onRestore={() => valuer.set('extraRaiderPerPopulation', 0)}
      />
    </Col>
  </Row>
);

export const VarianceAttribute = ({valuer, state, checked, disabled, inputDisabled}: {
  checked: boolean;
  valuer: UseValuesHook<ActionSetRaider>;
  state: UseValuesHook<SetRaiderActionAttributesProps>;
  disabled: boolean;
  inputDisabled: boolean;
}) => (
  <Row className="mb-2 mt-2">
    <PropertyCheckboxLabel
      caption="Variance"
      checked={checked}
      disabled={disabled}
      undefinedSetter={[valuer, 'variance', 0.5]}
      onChange={isChecked => state.set('varianceChecked', isChecked)}
    />
    <Col sm="4">
      <NumberInput
        labelAfter="y"
        maxLength={3}
        decimals={1}
        min={PERIOD_MIN}
        max={PERIOD_MAX}
        disabled={inputDisabled}
        placeholder="e.g. 1"
        value={valuer.get('variance', 0.5)}
        onChange={value => valuer.set('variance', value)}
        shuffle
        onShuffle={() => valuer.set('variance', randomPeriod())}
        allowRestore
        onRestore={() => valuer.set('variance', 0.5)}
      />
    </Col>
  </Row>
);

export const MaxesAttribute = ({valuer, state, checked, disabled, minsDisabled}: {
  checked: boolean;
  valuer: UseValuesHook<ActionSetRaider>;
  state: UseValuesHook<SetRaiderActionAttributesProps>;
  disabled: boolean;
  minsDisabled: boolean;
}) => (
  <Row className="mb-2">
    <PropertyCheckboxLabel
      caption="Maxes"
      checked={checked}
      disabled={disabled}
      undefinedSetter={[valuer, 'maxes', []]}
      onChange={isChecked => state.set('maxesChecked', isChecked)}
    />
    <Col sm="5">
      <TagNumberInput
        disabled={minsDisabled}
        min={ENTITY_COUNT_MIN}
        max={ENTITY_COUNT_MAX}
        value={valuer.get('maxes', [])}
        placeholder="e.g., 3"
        onChange={values => valuer.overwrite('maxes', values)}/>
      <Form.Text
        className={cn('text-xxs position-relative', {'text-muted-deep': minsDisabled})}
        style={{top: -3}}>
        Press <span style={{color: '#ffb74d'}}>Enter</span> to insert,
        {' '} <span style={{color: '#ffb74d'}}>Up</span> to increase or
        {' '} <span style={{color: '#ffb74d'}}>Down</span> to decrease.
      </Form.Text>
    </Col>
  </Row>
);

export const MinsAttribute = ({valuer, state, checked, disabled, minsDisabled}: {
  checked: boolean;
  valuer: UseValuesHook<ActionSetRaider>;
  state: UseValuesHook<SetRaiderActionAttributesProps>;
  disabled: boolean;
  minsDisabled: boolean;
}) => (
  <Row className="mt-2">
    <PropertyCheckboxLabel
      caption="Mins"
      checked={checked}
      disabled={disabled}
      undefinedSetter={[valuer, 'mins', []]}
      onChange={isChecked => state.set('minsChecked', isChecked)}
    />
    <Col sm="5">
      <TagNumberInput
        disabled={minsDisabled}
        min={ENTITY_COUNT_MIN}
        max={ENTITY_COUNT_MAX}
        value={valuer.get('mins', [])}
        placeholder="e.g., 1"
        onChange={values => valuer.overwrite('mins', values)}/>
      <Form.Text
        className={cn('text-xxs position-relative', {'text-muted-deep': minsDisabled})}
        style={{top: -3}}>
        Press <span style={{color: '#ffb74d'}}>Enter</span> to insert,
        {' '} <span style={{color: '#ffb74d'}}>Up</span> to increase or
        {' '} <span style={{color: '#ffb74d'}}>Down</span> to decrease.
      </Form.Text>
    </Col>
  </Row>
);

export const PopulationAttribute = ({valuer, disabled}: {
  valuer: UseValuesHook<ActionSetRaider>;
  disabled: boolean;
}) => (
  <Row className="mt-2">
    <PropertyLabel caption="Population"/>
    <AttributeRangeValue
      colProps={{sm: '6'}}
      disabled={disabled}
      min={valuer.get('min', 1)}
      max={valuer.get('max', 1)}
      sliderProps={{min: ENTITY_COUNT_MIN, max: ENTITY_COUNT_MAX}}
      allowRestore
      onRestore={(excludeMin, excludeMax) => {
        !excludeMin && valuer.set('min', 1);
        !excludeMax && valuer.set('max', 1);
      }}
      allowShuffle
      onShuffle={(excludeMin, excludeMax) => {
        const [min, max] = randomEntityMinMax();
        !excludeMin && valuer.set('min', min);
        !excludeMax && valuer.set('max', max);
      }}
      onChange={(min, max) => {
        valuer.set('min', min);
        valuer.set('max', max);
      }}
    />
  </Row>
);

export const WavesButtonToolbar = ({disabled, state, waves, tabCount, waveCount}: {
  disabled: boolean;
  state: UseValuesHook<SetRaiderActionAttributesProps>;
  waves: UseValuesHook<WavesState>;
  tabCount: number;
  waveCount: React.MutableRefObject<{ uid: number }>;
}) => (
  <ButtonToolbar
    className="justify-content-between pl-3 pr-3 mt-3">
    <ButtonGroup>
      <LinkButton
        className="ml-0 text-size-xs"
        disabled={disabled || tabCount >= WAVES_CREATE_MAX}
        color="SUCCESS"
        onClick={() => {
          // @ts-ignore
          const uniqueId = 'Wave_' + (++waveCount.current.uid);
          waves.set(uniqueId, {});
          state.set('activeKey', uniqueId);
        }}><IconNew/> New Wave</LinkButton>
      <LinkButton
        color="REDDISH"
        className="ml-2 text-size-xs"
        disabled={disabled || !tabCount}
        onClick={() => {
          waves.clear();
          waveCount.current.uid = 0;
        }}>
        <IconClear/> Remove All
      </LinkButton>
    </ButtonGroup>
    {!!tabCount && (
      <InputGroup>
        <InputGroup.Text
          as="span"
          className={cn('border-0 pl-2 pr-2 pt-0 pb-0 bg-transparent', {
            'text-muted text-line-through': disabled,
          })}>{!tabCount ? <>&nbsp;</> : <>{tabCount} / {WAVES_CREATE_MAX}</>}
        </InputGroup.Text>
      </InputGroup>
    )}
  </ButtonToolbar>
);
