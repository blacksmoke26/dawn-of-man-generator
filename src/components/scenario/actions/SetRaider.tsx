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
import {Col, Form, Row, Tab, Tabs} from 'react-bootstrap';

// elemental components
import TabTitle from '~/components/ui/TabTitle';
import Accordion from '~/components/ui/Accordion';
import ActionHeader from './elements/ActionHeader';
import NumberInput from '~/components/ui/NumberInput';
import PropertyLabel from '~/components/ui/PropertyLabel';
import RandomizeValuesButton from '~/components/ui/RandomizeValuesButton';
import AttributeSelect from '~/components/ui/elements/AttributeSelect';

// components
import RaiderWave from '~/components/scenario/actions/set-raider/RaiderWave';

// icons

// hooks
import useValues from '~/hooks/use-values';

// utils
import {findNextTab} from '~/helpers/ui';
import {actionDefaultProps} from './utils/default';
import {PERIOD_MAX, PERIOD_MIN} from '~/utils/defaults';
import {ERAS} from '~/utils/condition';
import {ENTITIES_LIVING, techEntities} from '~/utils/entities';
import {randomPeriod} from '~/utils/random';
import {ACTION_NAME, onInitialize, randomizeValues, triggerEvents, type WavesState} from './utils/set-raider';

// parsers
// types
import type {ActionAttributesProps, ActionProps, ActionSetRaider, RaidWaveParameters} from '~/types/action.types';
import {
  EntityTypesAttribute,
  ExtraRaidersAttribute,
  GracePeriodAttribute,
  HardcoreTimerAttribute,
  MaxesAttribute,
  MinsAttribute,
  PopulationAttribute,
  VarianceAttribute,
  WavesButtonToolbar,
} from '~/components/scenario/actions/elements/set-raider';

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
}

const SetRaider = (props: Props) => {
  const waveCount = React.useRef<{ uid: number }>({uid: 1});

  const newProps = merge<Required<Props>>(actionDefaultProps, props);
  const valuer = useValues<ActionSetRaider>({} as ActionSetRaider);

  const [init, setInit] = React.useState<boolean>(false);

  const state = useValues<SetRaiderActionAttributesProps>({} as SetRaiderActionAttributesProps);

  const waves = useValues<WavesState>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => onInitialize({state, waves, valuer, props, setInit}), []);

  // Reflect values changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => triggerEvents({init, valuer, waves, state, props}), [
    init,
    state.data.disabled, valuer.data, waves.data,
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
  const wavesTabsCount = Object.keys(waves.data).length;
  const wavesDisabled = isDisabled || !state.data.wavesChecked;

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
            <EntityTypesAttribute disabled={isDisabled} valuer={valuer}/>
            <PopulationAttribute disabled={isDisabled} valuer={valuer}/>
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
              <RandomizeValuesButton
                className="pl-3 pr-3 "
                buttonOnly={true}
                disabled={isDisabled}
                onClick={() => randomizeValues({valuer, state})}
              />
            )}
            eventKey="set_raider_optional_parameters">
            <div className="pl-3 pr-3">
              <HardcoreTimerAttribute
                disabled={isDisabled || !state.data.hardcoreTimerChecked}
                valuer={valuer}
                state={state}
                checked={state.data.hardcoreTimerChecked}
              />
              <MinsAttribute
                disabled={isDisabled}
                valuer={valuer}
                state={state}
                checked={state.data.minsChecked}
                minsDisabled={isMinsDisabled}
              />
              <MaxesAttribute
                disabled={isDisabled}
                valuer={valuer}
                state={state}
                checked={state.data.maxesChecked}
                minsDisabled={isMaxesDisabled}
              />
              <ExtraRaidersAttribute
                disabled={isDisabled}
                valuer={valuer}
                state={state}
                checked={state.data.extraRaiderPerPopulationChecked}
                inputDisabled={isDisabled || !state.data.extraRaiderPerPopulationChecked}
              />
              <GracePeriodAttribute
                checked={state.data.gracePeriodChecked}
                valuer={valuer}
                state={state}
                disabled={isDisabled}
                inputDisabled={isDisabled || !state.data.gracePeriodChecked}
              />
              <VarianceAttribute
                checked={state.data.varianceChecked}
                valuer={valuer}
                state={state}
                disabled={isDisabled}
                inputDisabled={isDisabled || !state.data.varianceChecked}
              />
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
              <WavesButtonToolbar
                waves={waves}
                state={state}
                disabled={wavesDisabled}
                waveCount={waveCount}
                tabCount={wavesTabsCount}
              />
              <Tabs
                id="waves-tab"
                navbar
                activeKey={state.data.activeKey}
                className={cn('nav-tabs-bottom mt-2 mb-0', {'border-0': !wavesTabsCount})}
                onSelect={k => state.set('activeKey', k as string)}>
                {Object.entries(waves.data || {}).map(([id, initialValues]) => (
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
                        onRemove={() => {
                          findNextTab(waves.data, id, state.data.activeKey, (nextTab, newLocations) => {
                            waves.remove(nextTab);
                            state.set('activeKey', nextTab);
                          });
                        }}/>
                    }>
                    <div className="pl-3 pr-3 pt-2">
                      <RaiderWave
                        disabled={wavesDisabled}
                        initialValues={initialValues}
                        onValuesChange={(values: RaidWaveParameters) => {
                          waves.overwrite(id, values);
                        }}
                      />
                    </div>
                  </Tab>
                ))}
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
      }),
    ),
  }),
  onChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  onTemplate: PropTypes.func,
};


export default SetRaider;
