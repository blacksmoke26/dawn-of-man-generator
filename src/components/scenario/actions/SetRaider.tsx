/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-26
 * @version 2.4
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {capitalCase} from 'change-case';
import uniqueRandomArray from 'unique-random-array';
import {ButtonGroup, ButtonToolbar, Col, Form, InputGroup, Row, Tab, Tabs} from 'react-bootstrap';

// elemental components
import TabTitle from '~/components/ui/TabTitle';
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import LinkButton from '~/components/ui/LinkButton';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import TagNumberInput from '~/components/ui/TagNumberInput';
import PropertyCheckboxLabel from '~/components/ui/PropertyCheckboxLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';
import AttributeRangeValue from '~/components/ui/elements/AttributeValueRange';
import AttributeSelect, {Option} from '~/components/ui/elements/AttributeSelect';

// components
import RaiderWave from '~/components/scenario/actions/set-raider/RaiderWave';

// icons
import {IconClear, IconNew} from '~/components/icons/app';

// hooks
import useValues from '~/hooks/use-values';

// utils
import {findNextTabKey} from '~/helpers/ui';
import {filterEmpty} from '~/utils/template';
import {defaultsParams} from '~/utils/action';
import {actionDefaultProps} from './utils/default';
import {PERIOD_MAX, PERIOD_MIN, WAVES_CREATE_MAX} from '~/utils/defaults';
import {ENTITIES_LIVING, ENTITIES_LIVING_OPTIONS, techEntities} from '~/utils/entities';
import {ENTITY_COUNT_MAX, ENTITY_COUNT_MIN, ERAS} from '~/utils/condition';
import {randomArray, randomEntityCount, randomEntityMinMax, randomPeriod} from '~/utils/random';

// parsers
import {toActionTemplate} from '~/utils/parser/templates-action';

// types
import type {KVDocument} from '~/types/json.types';
import type {
  ActionAttributesProps,
  ActionName,
  ActionProps,
  ActionSetRaider,
  RaidWaveParameters,
} from '~/types/action.types';

export interface Props extends ActionProps<ActionSetRaider> {
}

export interface SetRaiderActionAttributesProps extends ActionAttributesProps {
  hardcoreTimerChecked: boolean;
  minsChecked: boolean;
  maxesChecked: boolean;
  extraRaiderPerPopulationChecked: boolean;
  gracePeriodChecked: boolean;
  varianceChecked: boolean;
  wavesChecked: boolean;
  activeKey: string;
  waves: KVDocument<RaidWaveParameters>;
}

const ACTION_NAME: ActionName = 'SetRaider';

const SetRaider = (props: Props) => {
  const waveCount = React.useRef<{ uid: number }>({uid: 1});

  const newProps = merge<Required<Props>>(actionDefaultProps, props);

  const valuer = useValues<Partial<ActionSetRaider>>(
    merge(defaultsParams?.setRaider || {}, props?.initialValues || {}),
  );

  const state = useValues<SetRaiderActionAttributesProps>({
    disabled: newProps.disabled as boolean,
    disabledCheckbox: newProps.disabledCheckbox as boolean,
    expanded: newProps.expanded as boolean || true,
    hardcoreTimerChecked: !valuer.is('hardcoreTimer', undefined),
    minsChecked: !valuer.is('mins', undefined),
    maxesChecked: !valuer.is('maxes', undefined),
    extraRaiderPerPopulationChecked: !valuer.is('extraRaiderPerPopulation', undefined),
    gracePeriodChecked: !valuer.is('gracePeriod', undefined),
    varianceChecked: !valuer.is('variance', undefined),
    wavesChecked: true,
    activeKey: '',
    waves: {},
  });

  // Reflect values changes
  React.useEffect(() => {
    const changedValues = {...valuer.data};

    !state.data.hardcoreTimerChecked && (changedValues.hardcoreTimer = undefined);
    !state.data.minsChecked && (changedValues.mins = undefined);
    !state.data.maxesChecked && (changedValues.maxes = undefined);
    !state.data.extraRaiderPerPopulationChecked && (changedValues.extraRaiderPerPopulation = undefined);
    !state.data.gracePeriodChecked && (changedValues.gracePeriod = undefined);
    !state.data.varianceChecked && (changedValues.variance = undefined);
    !state.data.wavesChecked && (changedValues.waves = undefined);

    newProps?.onTemplate(toActionTemplate(ACTION_NAME, changedValues, state.data.disabled));
    newProps?.onValuesChange(filterEmpty(changedValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.data.disabled, valuer.data,
    state.data.hardcoreTimerChecked,
    state.data.minsChecked,
    state.data.maxesChecked,
    state.data.extraRaiderPerPopulationChecked,
    state.data.gracePeriodChecked,
    state.data.varianceChecked,
    state.data.wavesChecked,
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

  const isDisabled = newProps.disabledCheckbox || newProps.disabled;
  const isMinsDisabled = isDisabled || !state.data.minsChecked;
  const isMaxesDisabled = isDisabled || !state.data.maxesChecked;

  const wavesTabsCount = Object.keys(state.data.waves).length;

  const removeWaveTab = (tabId: string): void => {
    state.set('activeKey', findNextTabKey(Object.keys(state.data.waves), state.data.activeKey, tabId));
    state.remove(`waves.${tabId}`);
  };

  const wavesDisabled = isDisabled || !state.data.wavesChecked;
  const renderWaves = (): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];
    const waves = Object.entries(state.data.waves || {});

    for (const [id, initialValues] of waves) {
      elements.push(
        <Tab
          disabled={wavesDisabled}
          eventKey={id}
          key={id}
          as="div"
          active={state.data.activeKey === id}
          title={
            <TabTitle
              className="text-size-xs"
              title={id.replace('_', ' ')}
              disabled={wavesDisabled}
              onRemove={() => removeWaveTab(id)}/>
          }>
          <div className="pl-3 pr-3 pt-2">
            <RaiderWave
              disabled={wavesDisabled}
              initialValues={initialValues}
              onValuesChange={(values: RaidWaveParameters) => {
                state.set(`waves`, (current: RaidWaveParameters) => {
                  const changed = {...current} as SetRaiderActionAttributesProps['waves'];
                  changed[id] = values;
                  valuer.set('waves', Object.values(changed));
                  return changed;
                });
              }}
            />
          </div>
        </Tab>,
      );
    }

    return elements;
  };

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
          <div className="pl-3 pr-3">
            <Row className="mt-3">
              <PropertyLabel caption="Era"/>
              <AttributeSelect
                className="w-75"
                colProps={{sm: '6'}}
                disabled={isDisabled}
                options={ERAS.map(value => ({label: capitalCase(value), value}))}
                value={valuer.get('era', 'Paleolithic')}
                onSelect={option => valuer.set('era', option.value)}
                allowShuffle
                onShuffle={() => {
                  valuer.set('techEra', uniqueRandomArray(ERAS));
                }}
              />
            </Row>
            <Row className="mt-2">
              <PropertyLabel caption="Entity types"/>
              <AttributeSelect
                className="w-75"
                colProps={{sm: '10'}}
                disabled={isDisabled}
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
            <Row className="mt-2">
              <PropertyLabel caption="Population"/>
              <AttributeRangeValue
                colProps={{sm: '6'}}
                disabled={isDisabled}
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
            <Row className="mb-2 mt-2">
              <PropertyLabel caption="Period"/>
              <Col sm="4">
                <NumberInput
                  labelAfter="y"
                  maxLength={3}
                  decimals={1}
                  min={PERIOD_MIN}
                  max={PERIOD_MAX}
                  disabled={isDisabled}
                  placeholder="e.g. 0.5"
                  value={valuer.get('period', 1.5)}
                  onChange={value => valuer.set('period', value)}
                  shuffle
                  onShuffle={() => valuer.set('period', randomPeriod())}
                  allowRestore
                  onRestore={() => valuer.set('period', 1.5)}
                />
              </Col>
            </Row>
          </div>

          <Accordion
            noBodyPad={true}
            noCard={true}
            headerProps={{
              className: 'd-flex justify-content-between pr-3',
            }}
            header={<span className="pl-3 pr-3">Optional parameters</span>}
            headerAfter={(
              <>
                <RandomizeValuesButton
                  className="pl-3 pr-3 "
                  buttonOnly={true}
                  disabled={isDisabled}
                  onClick={() => {
                    valuer.set('era', uniqueRandomArray(ERAS));
                    state.data.hardcoreTimerChecked && valuer.set('hardcoreTimer', randomPeriod());
                    valuer.set('entityTypes', randomArray(ENTITIES_LIVING as string[], 5, true));

                    const [min, max] = randomEntityMinMax();
                    valuer.set('min', min);
                    valuer.set('max', max);

                    state.data.extraRaiderPerPopulationChecked && valuer.set('extraRaiderPerPopulation', randomEntityCount());
                    state.data.gracePeriodChecked && valuer.set('gracePeriod', randomPeriod());
                    valuer.set('period', randomPeriod());
                    state.data.varianceChecked && valuer.set('variance', randomPeriod());
                    state.data.wavesChecked && valuer.set('waves', []);

                    const range1 = randomEntityMinMax();
                    const range2 = randomEntityMinMax();
                    const range3 = randomEntityMinMax();

                    state.data.minsChecked && valuer.set('mins', [range1[0], range2[0], range3[0]]);
                    state.data.maxesChecked && valuer.set('maxes', [range1[1], range2[1], range3[1]]);
                  }}
                />
              </>
            )}
            eventKey="set_raider_optional_parameters">
            <div className="pl-3 pr-3">
              <Row className="mt-2">
                <PropertyCheckboxLabel
                  caption="Hardcore timer"
                  checked={state.data.hardcoreTimerChecked}
                  disabled={isDisabled}
                  undefinedSetter={[valuer, 'hardcoreTimer', 10]}
                  onChange={isChecked => state.set('hardcoreTimerChecked', isChecked)}
                />
                <Col sm="4">
                  <NumberInput
                    maxLength={3}
                    decimals={1}
                    min={PERIOD_MIN}
                    max={PERIOD_MAX}
                    disabled={isDisabled || !state.data.hardcoreTimerChecked}
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
              <Row className="mt-2">
                <PropertyCheckboxLabel
                  caption="Mins"
                  checked={state.data.minsChecked}
                  disabled={isDisabled}
                  undefinedSetter={[valuer, 'mins', []]}
                  onChange={isChecked => state.set('minsChecked', isChecked)}
                />
                <Col sm="5">
                  <TagNumberInput
                    disabled={isMinsDisabled}
                    min={ENTITY_COUNT_MIN}
                    max={ENTITY_COUNT_MAX}
                    value={valuer.get('mins', [])}
                    placeholder="e.g., 1"
                    onChange={values => {
                      valuer.overwrite('mins', values);
                    }}/>
                  <Form.Text
                    className={cn('text-xxs position-relative', {'text-muted-deep': isMinsDisabled})}
                    style={{top: -3}}>
                    Press <span style={{color: '#ffb74d'}}>Enter</span> to insert,
                    {' '} <span style={{color: '#ffb74d'}}>Up</span> to increase or
                    {' '} <span style={{color: '#ffb74d'}}>Down</span> to decrease.
                  </Form.Text>
                </Col>
              </Row>
              <Row className="mb-2">
                <PropertyCheckboxLabel
                  caption="Maxes"
                  checked={state.data.maxesChecked}
                  disabled={isDisabled}
                  undefinedSetter={[valuer, 'maxes', []]}
                  onChange={isChecked => state.set('maxesChecked', isChecked)}
                />
                <Col sm="5">
                  <TagNumberInput
                    disabled={isMaxesDisabled}
                    min={ENTITY_COUNT_MIN}
                    max={ENTITY_COUNT_MAX}
                    value={valuer.get('maxes', [])}
                    placeholder="e.g., 3"
                    onChange={values => {
                      valuer.overwrite('maxes', values);
                    }}/>
                  <Form.Text
                    className={cn('text-xxs position-relative', {'text-muted-deep': isMaxesDisabled})}
                    style={{top: -3}}>
                    Press <span style={{color: '#ffb74d'}}>Enter</span> to insert,
                    {' '} <span style={{color: '#ffb74d'}}>Up</span> to increase or
                    {' '} <span style={{color: '#ffb74d'}}>Down</span> to decrease.
                  </Form.Text>
                </Col>
              </Row>
              <Row className="mt-2">
                <PropertyCheckboxLabel
                  caption="Extra raiders"
                  tooltip="Additional raiders per population"
                  checked={state.data.extraRaiderPerPopulationChecked}
                  disabled={isDisabled}
                  undefinedSetter={[valuer, 'extraRaiderPerPopulation', 0]}
                  onChange={isChecked => state.set('extraRaiderPerPopulationChecked', isChecked)}
                />
                <Col sm="4">
                  <NumberInput
                    maxLength={3}
                    min={ENTITY_COUNT_MIN}
                    max={ENTITY_COUNT_MAX}
                    disabled={isDisabled || !state.data.extraRaiderPerPopulationChecked}
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
              <Row className="mt-2">
                <PropertyCheckboxLabel
                  caption="Grace period"
                  checked={state.data.gracePeriodChecked}
                  disabled={isDisabled}
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
                    disabled={isDisabled || !state.data.gracePeriodChecked}
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
              <Row className="mb-2 mt-2">
                <PropertyCheckboxLabel
                  caption="Variance"
                  checked={state.data.varianceChecked}
                  disabled={isDisabled}
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
                    disabled={isDisabled || !state.data.varianceChecked}
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
            </div>
          </Accordion>

          <div className="mb-2"></div>
          <Accordion
            noBodyPad={true}
            noCard={true}
            headerProps={{
              className: 'd-flex justify-content-between',
            }}
            header={<span
              className={cn('pl-3 text-size-xs')}>Waves <i>(optional)</i></span>}
            headerAfter={(
              <Form.Check
                type="switch"
                className="position-relative"
                style={{top: 7}}
                disabled={isDisabled}
                id={`events-switch-${nanoid(5)}`}
                label=""
                checked={state.data.wavesChecked}
                onChange={e => state.set('wavesChecked', e.target.checked)}
              />
            )}
            eventKey="waves_optional_parameters">
            <>
              <ButtonToolbar
                className="justify-content-between pl-3 pr-3 mt-3">
                <ButtonGroup>

                  <LinkButton
                    className="ml-0 text-size-xs"
                    disabled={wavesDisabled || wavesTabsCount >= WAVES_CREATE_MAX}
                    color="SUCCESS"
                    onClick={() => {
                      // @ts-ignore
                      const uniqueId = 'Wave_' + (++waveCount.current.uid);
                      state.set(`waves.${uniqueId}`, {});
                      state.set('activeKey', uniqueId);
                    }}><IconNew/> New Wave</LinkButton>
                  <LinkButton
                    color="REDDISH"
                    className="ml-2 text-size-xs"
                    disabled={wavesDisabled || !wavesTabsCount}
                    onClick={() => {
                      state.empty('waves');
                      waveCount.current.uid = 0;
                    }}>
                    <IconClear/> Remove All
                  </LinkButton>
                </ButtonGroup>
                {!!wavesTabsCount && (
                  <InputGroup>
                    <InputGroup.Text
                      as="span"
                      className={cn('border-0 pl-2 pr-2 pt-0 pb-0 bg-transparent', {
                        'text-muted text-line-through': wavesDisabled,
                      })}>{!wavesTabsCount ? <>&nbsp;</> : <>{wavesTabsCount} / {WAVES_CREATE_MAX}</>}
                    </InputGroup.Text>
                  </InputGroup>
                )}
              </ButtonToolbar>

              <Tabs
                id="waves-tab"
                navbar
                activeKey={state.data.activeKey}
                className={cn('nav-tabs-bottom mt-2 mb-0', {'border-0': !wavesTabsCount})}
                onSelect={k => state.set('activeKey', k as string)}>
                {renderWaves()}
              </Tabs>
            </>
          </Accordion>

          <div className="mb-3"></div>
        </>
      )}
    </div>
  );
};

// Properties validation
SetRaider.propTypes = {
  disabled: PropTypes.bool,
  disabledCheckbox: PropTypes.bool,
  removeIcon: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  expanded: PropTypes.bool,
  showHeader: PropTypes.bool,
  initialValues: PropTypes.exact({
    era: PropTypes.oneOf(ERAS),
    hardcoreTimer: PropTypes.number,
    entityTypes: PropTypes.arrayOf(PropTypes.oneOf(ENTITIES_LIVING)),
    min: PropTypes.number,
    max: PropTypes.number,
    mins: PropTypes.arrayOf(PropTypes.number),
    maxes: PropTypes.arrayOf(PropTypes.number),
    extraRaiderPerPopulation: PropTypes.number,
    gracePeriod: PropTypes.number,
    period: PropTypes.number,
    variance: PropTypes.number,
    waves: PropTypes.arrayOf(
      PropTypes.shape({
        shieldRatio: PropTypes.number,
        armorRatio: PropTypes.number,
        disabledTechs: PropTypes.arrayOf(PropTypes.oneOf(techEntities)),
      })
    ),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};

export default SetRaider;
