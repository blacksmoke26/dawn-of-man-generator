/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-13
 * @version 2.6.0
 */

import React from 'react';
import uniqueRandomArray from 'unique-random-array';

// utils
import {ERAS} from '~/utils/condition';
import {defaultsParams} from '~/utils/action';
import {ENTITIES_LIVING} from '~/utils/entities';
import {cloneObject, onlyKeys} from '~/helpers/object';
import {randomArray, randomEntityCount, randomEntityMinMax, randomPeriod} from '~/utils/random';

// parsers
import {filterEmpty} from '~/utils/template';
import {toActionTemplate} from '~/utils/parser/templates-action';

import type {UseValuesHook} from '~/hooks/use-values.types';
import type {ActionName, ActionSetRaider, RaidWaveParameters} from '~/types/action.types';
import type {Props, SetRaiderActionAttributesProps} from '../SetRaider';

export type WavesState = Record<string, RaidWaveParameters>;

export const ACTION_NAME: ActionName = 'SetRaider';

export const randomizeValues = (args: {
  valuer: UseValuesHook<ActionSetRaider>;
  state: UseValuesHook<SetRaiderActionAttributesProps>
}) => {
  const {valuer, state} = args;

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
}
export const onInitialize = (args: {
  setInit: React.Dispatch<React.SetStateAction<boolean>>;
  valuer: UseValuesHook<ActionSetRaider>;
  waves: UseValuesHook<WavesState>;
  state: UseValuesHook<SetRaiderActionAttributesProps>
  props: Props;
}) => {
  const {setInit, props, valuer, waves, state} = args;

  setInit(true);
  const initial = {...defaultsParams?.setRaider, ...(props?.initialValues || {})};

  valuer.setAll(onlyKeys(initial as ActionSetRaider, ['waves'], true));

  let lastWaveTab = '';

  waves.setAll(cloneObject(initial?.waves ?? [])?.reduce((accum, current, index) => {
    lastWaveTab = `Wave_${index + 1}`;
    accum[lastWaveTab] = current as RaidWaveParameters;
    return accum;
  }, {} as WavesState) ?? {});

  state.setAll({
    disabled: props?.disabled ?? false,
    disabledCheckbox: props?.disabledCheckbox ?? false,
    expanded: props?.expanded ?? true,
    hardcoreTimerChecked: !valuer.is('hardcoreTimer', undefined),
    minsChecked: !valuer.is('mins', undefined),
    maxesChecked: !valuer.is('maxes', undefined),
    extraRaiderPerPopulationChecked: !valuer.is('extraRaiderPerPopulation', undefined),
    gracePeriodChecked: !valuer.is('gracePeriod', undefined),
    varianceChecked: !valuer.is('variance', undefined),
    wavesChecked: true,
    activeKey: lastWaveTab,
  });
}
export const triggerEvents = (args: {
  init: boolean; valuer: UseValuesHook<ActionSetRaider>;
  waves: UseValuesHook<WavesState>;
  state: UseValuesHook<SetRaiderActionAttributesProps>
  props: Props;
}) => {
  const {init, valuer, waves, state, props} = args;

  if (!init) return;

  const changedValues = {...valuer.data};
  changedValues.waves = Object.values(waves.data);

  !state.data.hardcoreTimerChecked && (changedValues.hardcoreTimer = undefined);
  !state.data.minsChecked && (changedValues.mins = undefined);
  !state.data.maxesChecked && (changedValues.maxes = undefined);
  !state.data.extraRaiderPerPopulationChecked && (changedValues.extraRaiderPerPopulation = undefined);
  !state.data.gracePeriodChecked && (changedValues.gracePeriod = undefined);
  !state.data.varianceChecked && (changedValues.variance = undefined);
  !state.data.wavesChecked && (changedValues.waves = undefined);

  props?.onTemplate?.(toActionTemplate(ACTION_NAME, changedValues, state.data.disabled));
  props?.onValuesChange?.(filterEmpty(changedValues));
};
