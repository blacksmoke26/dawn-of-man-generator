/* eslint-disable */
/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import cn from 'classname';
import {nanoid} from 'nanoid';
import merge from 'deepmerge';
import * as PropTypes from 'prop-types';
import {Button, ButtonGroup, Form} from 'react-bootstrap';

// elemental components
import Slider from '~/components/ui/Slider';

// icons
import {
  IconShuffle,
  IconRaiseUp,
  IconRaiseDown,
  IconEnabled,
  IconDisabled,
  COLOR_DISABLED, COLOR_WHITISH, COLOR_REDDISH,
} from '~/components/icons/app';

// utils
import {randomFrequency, randomFrequencies} from '~/utils/random';

// redux
import {useAppSelector} from '~redux/hooks';

// types
import type {$Keys} from 'utility-types';

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

/** NoiseAmplitudes `props` type */
export interface Props {
  enabled?: boolean;
  frequencies?: ValueFrequencies;

  onChange?(template: string, values: ValueFrequencies): void;
}

/** NoiseAmplitudes functional component */
const NoiseAmplitudes = (props: Props) => {
  props = merge({
    enabled: true,
    frequencies: {...randomFrequencies()},
    onChange: () => {
    },
  }, props);

  const [frequencies, setFrequencies] = React.useState<ValueFrequencies>(props.frequencies as ValueFrequencies);
  // @ts-ignore
  const [enabled, setEnabled] = React.useState<boolean>(props.frequencies !== false || props.enabled);
  // @ts-ignore
  const [freqEnabled, setFreqEnabled] = React.useState<FrequencyEnabled>({
    freq2: true,
    freq3: true,
    freq4: true,
    freq5: true,
    freq6: true,
    freq7: true,
    freq8: true,
  });

  const freq2Enabled = enabled && freqEnabled.freq2;
  const freq3Enabled = enabled && freqEnabled.freq3;
  const freq4Enabled = enabled && freqEnabled.freq4;
  const freq5Enabled = enabled && freqEnabled.freq5;
  const freq6Enabled = enabled && freqEnabled.freq6;
  const freq7Enabled = enabled && freqEnabled.freq7;
  const freq8Enabled = enabled && freqEnabled.freq8;

  const toggleFrequency = (name: $Keys<FrequencyEnabled>, status: boolean): void => {
    setFreqEnabled(current => ({
      ...current,
      [name]: status,
    }));
  };

  const noiseAmplitudesAttribute = useAppSelector(({environment}) => environment.values?.noiseAmplitudes);

  const filterEnabledFrequencies = <T = string>(list: T[]): Record<keyof ValueFrequencies, T> => {
    const values: Partial<Record<keyof ValueFrequencies, T>> = {
      freq1: list[0],
    };

    freqEnabled.freq2 && (values.freq2 = list[1]);
    freqEnabled.freq3 && (values.freq3 = list[2]);
    freqEnabled.freq4 && (values.freq4 = list[3]);
    freqEnabled.freq5 && (values.freq5 = list[4]);
    freqEnabled.freq6 && (values.freq6 = list[5]);
    freqEnabled.freq7 && (values.freq7 = list[6]);
    freqEnabled.freq8 && (values.freq8 = list[7]);
    return values as Record<keyof ValueFrequencies, T>;
  };

  // Reflect attributes changes
  React.useEffect(() => {
    const extValue = noiseAmplitudesAttribute ?? null;

    if (typeof extValue === 'boolean') {
      setEnabled(extValue);
    }
    if (Array.isArray(extValue) && extValue.length === 8) {
      for (let i = 0; i <= 7; i++) {
        setFrequency(`freq${i + 1}`, extValue[i] as unknown as number);
      }
      setEnabled(true);
      setFreqEnabled({
        freq2: true,
        freq3: true,
        freq4: true,
        freq5: true,
        freq6: true,
        freq7: true,
        freq8: true,
      });
    }
  }, [noiseAmplitudesAttribute]);

  // Reflect state changes
  React.useEffect(() => {
    typeof props.onChange === 'function' && props.onChange(toTemplateText(), frequencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, frequencies, freqEnabled]);

  /** Generate xml code */
  const toTemplateText = React.useCallback((): string => {
    if (!enabled) {
      return '';
    }

    const list: string[] = Object.values(frequencies)
      .map(c => Number(c).toFixed(3));
    const values = filterEnabledFrequencies<string>(list);
    return `<noise_amplitudes values="${Object.values(values).join(' ')}"/>`;
  }, [frequencies, enabled, freqEnabled]);

  /** Update frequency value */
  const setFrequency = (name: string, value: number): void => {
    setFrequencies(current => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="text-size-xxs text-muted mb-1">
        Modify the amplitudes of the different noise layers, the initial numbers
        define the amplitudes of the low-frequencies (the height of large mountains), and the later
        numbers define the amplitudes of the high_frequencies (the height of the small bumps).
        <p className="mt-1">
          For a complete guide: <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2087224377"
                                   title="This guide explains how the <noise_amplitude> element works in Environment configuration files. It will help build your intuition for how amplitudes influence one another so you can more quickly achieve the results you're looking for."
                                   target="_blank" rel="noopener noreferrer">
          Understanding Amplitudes in Environment
        </a>.
        </p>
        <div className="mt-2 mb-2">
          <Form>
            <Form.Switch
              className="pull-right"
              id={`switch-${nanoid(5)}`}
              label="Override noise amplitudes parameters"
              checked={enabled}
              onChange={(e: any) => setEnabled(e.target.checked)}
            />
          </Form>
        </div>
      </div>


      <div className={(cn('mb-2', 'checkbox-align'))}>
        <Form.Label className="text-size-sm mb-0" column={false}>
          <Form.Check
            disabled={!enabled}
            readOnly={true}
            checked={true}
            className="text-size-xs"
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={<>
              Frequency 1: <code
              className={(cn('pl-2 text-size-xs', {'text-muted': !enabled}))}>{frequencies.freq1}</code>
            </>}
          />
        </Form.Label>

        <Button disabled={!enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq1', randomFrequency())}>
          Random
        </Button>
        <Button disabled={!enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq1', 0)}>Min</Button>
        <Button disabled={!enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq1', 1)}>Max</Button>
        <Slider disabled={!enabled} step={0.001} value={frequencies.freq1}
                onChange={v => setFrequency('freq1', v as number)}/>
      </div>

      <div className={cn('mb-2', {'text-muted': !freq2Enabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm mb-0" column={false}>
          <Form.Check
            disabled={!enabled}
            className="text-size-xs"
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={<>
              Frequency 2: <code
              className={(cn('pl-2 text-size-xs', {'text-muted': !freq2Enabled}))}>{frequencies.freq2}</code>
            </>}
            checked={freqEnabled.freq2}
            onChange={e => toggleFrequency('freq2', e.target.checked)}
          />
        </Form.Label>
        <Button disabled={!freq2Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq2', randomFrequency())}>
          Random
        </Button>
        <Button disabled={!freq2Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq2', 0)}>Min</Button>
        <Button disabled={!freq2Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq2', 1)}>Max</Button>
        <Slider disabled={!freq2Enabled} step={0.001} value={frequencies.freq2}
                onChange={v => setFrequency('freq2', v as number)}/>
      </div>

      <div className={cn('mb-2', {'text-muted': !freq3Enabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm mb-0" column={false}>
          <Form.Check
            disabled={!enabled}
            className="text-size-xs"
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={<>
              Frequency 3: <code
              className={(cn('pl-2 text-size-xs', {'text-muted': !freq3Enabled}))}>{frequencies.freq3}</code>
            </>}
            checked={freqEnabled.freq3}
            onChange={e => toggleFrequency('freq3', e.target.checked)}
          />
        </Form.Label>
        <Button disabled={!freq3Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq3', randomFrequency())}>
          Random
        </Button>
        <Button disabled={!freq3Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq3', 0)}>Min</Button>
        <Button disabled={!freq3Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq3', 1)}>Max</Button>
        <Slider disabled={!freq3Enabled} step={0.001} value={frequencies.freq3}
                onChange={v => setFrequency('freq3', v as number)}/>
      </div>

      <div className={cn('mb-2', {'text-muted': !freq4Enabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm mb-0" column={false}>
          <Form.Check
            disabled={!enabled}
            className="text-size-xs"
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={<>
              Frequency 4: <code
              className={(cn('pl-2 text-size-xs', {'text-muted': !freq4Enabled}))}>{frequencies.freq4}</code>
            </>}
            checked={freqEnabled.freq4}
            onChange={e => toggleFrequency('freq4', e.target.checked)}
          />
        </Form.Label>
        <Button disabled={!freq4Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq4', randomFrequency())}>
          Random
        </Button>
        <Button disabled={!freq4Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq4', 0)}>Min</Button>
        <Button disabled={!freq4Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq4', 1)}>Max</Button>
        <Slider disabled={!freq4Enabled} step={0.001} value={frequencies.freq4}
                onChange={v => setFrequency('freq4', v as number)}/>
      </div>

      <div className={cn('mb-2', {'text-muted': !freq5Enabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm mb-0" column={false}>
          <Form.Check
            disabled={!enabled}
            className="text-size-xs"
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={<>
              Frequency 5: <code
              className={(cn('pl-2 text-size-xs', {'text-muted': !freq5Enabled}))}>{frequencies.freq5}</code>
            </>}
            checked={freqEnabled.freq5}
            onChange={e => toggleFrequency('freq5', e.target.checked)}
          />
        </Form.Label>
        <Button disabled={!freq5Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq5', randomFrequency())}>
          Random
        </Button>
        <Button disabled={!freq5Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq5', 0)}>Min</Button>
        <Button disabled={!freq5Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq5', 1)}>Max</Button>
        <Slider disabled={!freq5Enabled} step={0.001} value={frequencies.freq5}
                onChange={v => setFrequency('freq5', v as number)}/>
      </div>

      <div className={cn('mb-2', {'text-muted': !freq6Enabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm mb-0" column={false}>
          <Form.Check
            disabled={!enabled}
            className="text-size-xs"
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={<>
              Frequency 6: <code
              className={(cn('pl-2 text-size-xs', {'text-muted': !freq6Enabled}))}>{frequencies.freq6}</code>
            </>}
            checked={freqEnabled.freq6}
            onChange={e => toggleFrequency('freq6', e.target.checked)}
          />
        </Form.Label>
        <Button disabled={!freq6Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq6', randomFrequency())}>
          Random
        </Button>
        <Button disabled={!freq6Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq6', 0)}>Min</Button>
        <Button disabled={!freq6Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq6', 1)}>Max</Button>
        <Slider disabled={!freq6Enabled} step={0.001} value={frequencies.freq6}
                onChange={v => setFrequency('freq6', v as number)}/>
      </div>

      <div className={cn('mb-2', {'text-muted': !freq7Enabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm mb-0" column={false}>
          <Form.Check
            disabled={!enabled}
            className="text-size-xs"
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={<>
              Frequency 7: <code
              className={(cn('pl-2 text-size-xs', {'text-muted': !freq7Enabled}))}>{frequencies.freq7}</code>
            </>}
            checked={freqEnabled.freq7}
            onChange={e => toggleFrequency('freq7', e.target.checked)}
          />
        </Form.Label>
        <Button disabled={!freq7Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq7', randomFrequency())}>
          Random
        </Button>
        <Button disabled={!freq7Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq7', 0)}>Min</Button>
        <Button disabled={!freq7Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq7', 1)}>Max</Button>
        <Slider disabled={!freq7Enabled} step={0.001} value={frequencies.freq7}
                onChange={v => setFrequency('freq7', v as number)}/>
      </div>

      <div className={cn('mb-2', {'text-muted': !freq8Enabled}, 'checkbox-align')}>
        <Form.Label className="text-size-sm mb-0" column={false}>
          <Form.Check
            disabled={!enabled}
            className="text-size-xs"
            type="switch"
            id={`switch-${nanoid(5)}`}
            label={<>
              Frequency 8: <code
              className={(cn('pl-2 text-size-xs', {'text-muted': !freq8Enabled}))}>{frequencies.freq8}</code>
            </>}
            checked={freqEnabled.freq8}
            onChange={e => toggleFrequency('freq8', e.target.checked)}
          />
        </Form.Label>
        <Button disabled={!freq8Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq8', randomFrequency())}>
          Random
        </Button>
        <Button disabled={!freq8Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq8', 0)}>Min</Button>
        <Button disabled={!freq8Enabled} className="button-reset-sm" variant="link"
                onClick={() => setFrequency('freq8', 1)}>Max</Button>
        <Slider disabled={!freq8Enabled} step={0.001} value={frequencies.freq8}
                onChange={v => setFrequency('freq8', v as number)}/>
      </div>

      <div className="mt-2">
        <ButtonGroup size="sm">
          <Button
            disabled={!enabled} variant="link"
            style={{color: !enabled ? COLOR_DISABLED : COLOR_WHITISH}}
            className="text-size-sm button-reset-sm p-0 ml-0 mr-3" size="sm"
            onClick={() => {
              setFreqEnabled({
                freq2: true,
                freq3: true,
                freq4: true,
                freq5: true,
                freq6: true,
                freq7: true,
                freq8: true,
              });
            }}><IconEnabled/> Enable</Button>
          <Button
            disabled={!enabled} variant="link"
            style={{color: !enabled ? COLOR_DISABLED : COLOR_WHITISH}}
            className="text-size-sm button-reset-sm p-0 mr-3" size="sm"
            onClick={() => {
              const values = filterEnabledFrequencies<number>(Object.values(randomFrequencies(null))) as ValueFrequencies;
              setFrequencies((current) => ({...current, ...values}));
            }}><IconShuffle/> Randomize</Button>
          <Button
            disabled={!enabled} variant="link"
            style={{color: !enabled ? COLOR_DISABLED : COLOR_WHITISH}}
            className="text-size-sm button-reset-sm p-0 mr-3" size="sm"
            onClick={() => {
              const values = filterEnabledFrequencies<number>(Object.values(randomFrequencies(0))) as ValueFrequencies;
              setFrequencies((current) => ({...current, ...values}));
            }}><IconRaiseDown/> Min</Button>
          <Button
            disabled={!enabled} variant="link"
            style={{color: !enabled ? COLOR_DISABLED : COLOR_WHITISH}}
            className="text-size-sm button-reset-sm p-0 mr-3" size="sm"
            onClick={() => {
              const values = filterEnabledFrequencies<number>(Object.values(randomFrequencies(1))) as ValueFrequencies;
              setFrequencies((current) => ({...current, ...values}));
            }}><IconRaiseUp/> Max</Button>
          <Button
            disabled={!enabled} variant="link"
            style={{color: !enabled ? COLOR_DISABLED : COLOR_REDDISH}}
            className="text-size-sm button-reset-sm p-0" size="sm"
            onClick={() => {
              setFreqEnabled({
                freq2: false,
                freq3: false,
                freq4: false,
                freq5: false,
                freq6: false,
                freq7: false,
                freq8: false,
              });
            }}><IconDisabled/> Disable</Button>
        </ButtonGroup>
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
