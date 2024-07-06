/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-06
 * @version 2.5.0
 */

import React from 'react';

// utils
import {toFloat} from '~/helpers/number';

// parsers
import {toNoiseAmplitudesTemplate} from '~/utils/parser/environment/templates';

/** Frequencies type  */
export interface ValueFrequencies {
  freq1: number,
  freq2?: number,
  freq3?: number,
  freq4?: number,
  freq5?: number,
  freq6?: number,
  freq7?: number,
  freq8?: number,
}

/** Frequencies type  */
export interface FrequencyEnabled {
  freq2: boolean,
  freq3: boolean,
  freq4: boolean,
  freq5: boolean,
  freq6: boolean,
  freq7: boolean,
  freq8: boolean,
}


export const toggleAllFrequencies = (state: boolean = true): FrequencyEnabled => {
  return {
    freq2: state,
    freq3: state,
    freq4: state,
    freq5: state,
    freq6: state,
    freq7: state,
    freq8: state,
  };
};

export const resetAllValues = ({setFrequencies, setChecked, setFreqEnabled}: {
  setFrequencies: React.Dispatch<ValueFrequencies>,
  setChecked: React.Dispatch<boolean>,
  setFreqEnabled: React.Dispatch<FrequencyEnabled>,
}) => {
  setChecked(false);
  setFrequencies({
    freq1: 0,
    freq2: 0,
    freq3: 0,
    freq4: 0,
    freq5: 0,
    freq6: 0,
    freq7: 0,
    freq8: 0,
  });
  setFreqEnabled(toggleAllFrequencies(false));
};

export const filterEnabledFrequencies = (freqEnabled: FrequencyEnabled, list: number[]): Record<keyof ValueFrequencies, number> => {
  const values: Partial<Record<keyof ValueFrequencies, number>> = {
    freq1: list[0],
  };

  freqEnabled.freq2 && (values.freq2 = list[1]);
  freqEnabled.freq3 && (values.freq3 = list[2]);
  freqEnabled.freq4 && (values.freq4 = list[3]);
  freqEnabled.freq5 && (values.freq5 = list[4]);
  freqEnabled.freq6 && (values.freq6 = list[5]);
  freqEnabled.freq7 && (values.freq7 = list[6]);
  freqEnabled.freq8 && (values.freq8 = list[7]);
  return values as Record<keyof ValueFrequencies, number>;
};

/** Generate xml code */
export const toTemplateText = (values: ValueFrequencies, freqEnabled: FrequencyEnabled, disabled: boolean = false): string => {
  const normalized = Object.values(values).map(val => toFloat(val, 4));
  const frequencies = Object.values(filterEnabledFrequencies(freqEnabled, normalized));

  return toNoiseAmplitudesTemplate(frequencies, disabled);
};
