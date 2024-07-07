/* eslint-disable */
/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import {Button, ButtonGroup} from 'react-bootstrap';

// icons
import {Scroll} from 'lucide-react';
import {
  COLOR_DISABLED,
  COLOR_REDDISH,
  COLOR_WHITISH,
  IconDisabled,
  IconEnabled,
  IconRaiseDown,
  IconRaiseUp,
  IconShuffle,
} from '~/components/icons/app';

// components
import Header from './elements/Header';
import FrequencyAttribute from './elements/FrequencyAttribute';
import PopoverDropdown from '~/components/ui/PopoverDropdown';

// utils
import presets from './utils/presets';
import {randomFrequencies} from '~/utils/random';
import {
  configureFrequencies,
  filterEnabledFrequencies,
  type FrequencyEnabled,
  resetAllValues,
  toggleAllFrequencies,
  toTemplateText,
  type ValueFrequencies,
} from './utils/general';

// redux
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {clearProperty} from '~redux/slices/environment/reducers';

// types
import {environment} from '~/data/environments/parser/types';

/** NoiseAmplitudes `props` type */
export interface Props {
  enabled?: boolean;
  frequencies?: ValueFrequencies;

  onChange?(template: string, values: ValueFrequencies): void;
}

/** NoiseAmplitudes functional component */
const NoiseAmplitudes = (props: Props) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState<boolean>(props?.enabled ?? false);
  const [isOn, setIsOn] = React.useState<boolean>(true);
  const [frequencies, setFrequencies] = React.useState<ValueFrequencies>(props?.frequencies ?? randomFrequencies());
  const [freqEnabled, setFreqEnabled] = React.useState<FrequencyEnabled>(toggleAllFrequencies(true));

  const reduxState = useAppSelector(({environment}) => environment.values?.noiseAmplitudes);

  // Reflect attributes changes
  React.useEffect(() => {
    if (reduxState === null) {
      setIsOn(true);
      resetAllValues({setChecked, setFreqEnabled, setFrequencies});
      dispatch(clearProperty('noiseAmplitudes'));
    } else if (Array.isArray(reduxState) && reduxState.length) {
      setChecked(true);
      configureFrequencies(reduxState, {setFrequencies, setFreqEnabled});
      dispatch(clearProperty('noiseAmplitudes'));
    }
  }, [reduxState]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(
      toTemplateText(frequencies, freqEnabled, !checked), frequencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, frequencies, freqEnabled]);

  /** Update frequency value */
  const setFrequency = (name: string, value: number): void => {
    setFrequencies(current => ({...current, [name]: value}));
  };

  const toggleFrequency = (name: keyof FrequencyEnabled, status: boolean): void => {
    setFreqEnabled(current => ({...current, [name]: status}));
  };

  return (
    <>
      <Header checked={checked} onChange={setChecked}/>
      <FrequencyAttribute
        checked={true}
        disabled={!checked}
        disabledCheckbox={!checked}
        checkboxProps={{readOnly: true}}
        label="Frequency 1"
        value={frequencies.freq1}
        onChange={(value: number) => setFrequency('freq1', value)}
      />

      <FrequencyAttribute
        disabled={!checked || !freqEnabled.freq2}
        disabledCheckbox={!checked}
        checked={freqEnabled.freq2}
        label="Frequency 2"
        value={frequencies.freq2}
        onChange={(value: number) => setFrequency('freq2', value)}
        onCheckboxChange={isChecked => toggleFrequency('freq2', isChecked)}
      />

      <FrequencyAttribute
        disabled={!checked || !freqEnabled.freq3}
        disabledCheckbox={!checked}
        checked={freqEnabled.freq3}
        label="Frequency 3"
        value={frequencies.freq3}
        onChange={(value: number) => setFrequency('freq3', value)}
        onCheckboxChange={isChecked => toggleFrequency('freq3', isChecked)}
      />

      <FrequencyAttribute
        disabled={!checked || !freqEnabled.freq4}
        disabledCheckbox={!checked}
        checked={freqEnabled.freq4}
        label="Frequency 4"
        value={frequencies.freq4}
        onChange={(value: number) => setFrequency('freq4', value)}
        onCheckboxChange={isChecked => toggleFrequency('freq4', isChecked)}
      />

      <FrequencyAttribute
        disabled={!checked || !freqEnabled.freq5}
        disabledCheckbox={!checked}
        checked={freqEnabled.freq5}
        label="Frequency 5"
        value={frequencies.freq5}
        onChange={(value: number) => setFrequency('freq5', value)}
        onCheckboxChange={isChecked => toggleFrequency('freq5', isChecked)}
      />

      <FrequencyAttribute
        disabled={!checked || !freqEnabled.freq6}
        disabledCheckbox={!checked}
        checked={freqEnabled.freq6}
        label="Frequency 6"
        value={frequencies.freq6}
        onChange={(value: number) => setFrequency('freq6', value)}
        onCheckboxChange={isChecked => toggleFrequency('freq6', isChecked)}
      />

      <FrequencyAttribute
        disabled={!checked || !freqEnabled.freq7}
        disabledCheckbox={!checked}
        checked={freqEnabled.freq7}
        label="Frequency 7"
        value={frequencies.freq7}
        onChange={(value: number) => setFrequency('freq7', value)}
        onCheckboxChange={isChecked => toggleFrequency('freq7', isChecked)}
      />

      <FrequencyAttribute
        disabled={!checked || !freqEnabled.freq8}
        disabledCheckbox={!checked}
        checked={freqEnabled.freq8}
        label="Frequency 8"
        value={frequencies.freq8}
        onChange={(value: number) => setFrequency('freq8', value)}
        onCheckboxChange={isChecked => toggleFrequency('freq8', isChecked)}
      />

      <div className="mt-2">
        <ButtonGroup size="sm">
          <Button
            disabled={!checked} variant="link"
            title={isOn ? 'Enable optional sliders' : 'Disable optional sliders'}
            style={{color: !checked ? COLOR_DISABLED : (isOn ? COLOR_WHITISH : COLOR_REDDISH)}}
            className="text-size-sm button-reset-sm p-0 ml-0 mr-3" size="sm"
            onClick={() => {
              setIsOn(current => !current);
              setFreqEnabled(toggleAllFrequencies(isOn));
            }}>{isOn ? <IconEnabled/> : <IconDisabled/>} {isOn ? 'Enable' : 'Disable'}</Button>
          <Button
            disabled={!checked} variant="link"
            style={{color: !checked ? COLOR_DISABLED : COLOR_WHITISH}}
            className="text-size-sm button-reset-sm p-0 mr-3" size="sm"
            onClick={() => {
              const values = filterEnabledFrequencies(freqEnabled, Object.values(randomFrequencies(null))) as ValueFrequencies;
              setFrequencies((current) => ({...current, ...values}));
            }}><IconShuffle/> Randomize</Button>
          <Button
            disabled={!checked} variant="link"
            style={{color: !checked ? COLOR_DISABLED : COLOR_WHITISH}}
            className="text-size-sm button-reset-sm p-0 mr-3" size="sm"
            onClick={() => {
              const values = filterEnabledFrequencies(freqEnabled, Object.values(randomFrequencies(0))) as ValueFrequencies;
              setFrequencies((current) => ({...current, ...values}));
            }}><IconRaiseDown/> Min</Button>
          <Button
            disabled={!checked} variant="link"
            style={{color: !checked ? COLOR_DISABLED : COLOR_WHITISH}}
            className="text-size-sm button-reset-sm p-0" size="sm"
            onClick={() => {
              const values = filterEnabledFrequencies(freqEnabled, Object.values(randomFrequencies(1))) as ValueFrequencies;
              setFrequencies((current) => ({...current, ...values}));
            }}><IconRaiseUp/> Max</Button>
        </ButtonGroup>

        <div className="d-inline-block ml-3">
          <PopoverDropdown
            disabled={!checked}
            className="text-size-sm"
            placeholder="Presets"
            heading="Schwifty Presets"
            formatLabel={option => (
              <><Scroll color={COLOR_WHITISH} className="mr-1" width="16"/>{option.label}</>
            )}
            onSelect={option => {
              const params = (presets.find(item => item.id === option.value)?.values || [0]) as environment.NoiseAmplitudes;
              configureFrequencies(params, {setFrequencies, setFreqEnabled});
            }}
            options={presets.map(item => ({
              label: item.caption,
              value: item.id,
            }))}/>
        </div>
      </div>
    </>
  );
};

// Properties validation
NoiseAmplitudes.propTypes = {
  enabled: PropTypes.bool,
  frequencies: PropTypes.shape({
    freq1: PropTypes.number,
    freq2: PropTypes.number,
    freq3: PropTypes.number,
    freq4: PropTypes.number,
    freq5: PropTypes.number,
    freq6: PropTypes.number,
    freq7: PropTypes.number,
    freq8: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

export default NoiseAmplitudes;
