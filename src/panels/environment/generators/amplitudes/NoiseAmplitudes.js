// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button, ButtonGroup, Form } from 'react-bootstrap';

// Components
import UiSlider from './../../../../components/UiSlider';

// Utils
import * as random from '../../../../utils/random';
import { nanoid } from 'nanoid';
import cn from 'classname';

/**
 * Frequencies type
 * @type {Object} */
type ValueFrequencies = {
	freq1: number, freq2: number, freq3: number, freq4: number,
	freq5: number, freq6: number, freq7: number, freq8: number,
};

/**
 * NoiseAmplitudes `props` type
 * @type {Object}
 */
type Props = {
	enabled: boolean,
	frequencies?: ValueFrequencies,
	onChange ( template: string, values: ValueFrequencies ): void,
};

/** NoiseAmplitudes functional component */
function NoiseAmplitudes ( props: Props ) {
	const [frequencies, setFrequencies] = React.useState<ValueFrequencies>(props.frequencies);
	const [enabled, setEnabled] = React.useState<ValueFrequencies>(props.enabled);
	
	const {environment} = useSelector(( {environment} ) => ({environment}));
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = environment?.noiseAmplitudes ?? null;
		
		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
		}
		if ( Array.isArray(extValue) && extValue.length === 8 ) {
			for ( let i = 0; i <= 7; i++ ) {
				setFrequency(`freq${i+1}`, extValue[i]);
			}
			setEnabled(true);
		}
	}, [environment]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), frequencies);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enabled, frequencies]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		if ( !enabled ) {
			return '';
		}
		
		const values: string = Object.values(frequencies)
			.map(c => Number(c).toFixed(3))
			.join(' ');
		return `<noise_amplitudes values="${values}"/>`;
	}, [frequencies, enabled]);
	
	/** Update frequency value */
	const setFrequency = ( name: string, value: number ): void => {
		setFrequencies(current => ({
			...current,
			[name]: value,
		}))
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
					<Form.Check
						className="pull-right"
						type="switch"
						id={`seasons_override-switch-${nanoid(5)}`}
						label="Override noise amplitudes parameters"
						checked={enabled}
						onChange={e => setEnabled(e.target.checked)}
					/>
				</div>
			</div>
			<div className={(cn('mb-2', {'text-muted': !enabled}))}>
				Frequency 1: <code className={(cn('pl-2 text-size-xs', {'text-muted': !enabled}))}>{frequencies.freq1}</code>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq1', random.randomFrequency())}>
					Random
				</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq1', 0)}>Min</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq1', 1)}>Max</Button>
				<UiSlider disabled={!enabled} step={0.001} value={frequencies.freq1} onChange={v => setFrequency('freq1', v)}/>
			</div>
			<div className={(cn('mb-2', {'text-muted': !enabled}))}>
				Frequency 2: <code className={(cn('pl-2 text-size-xs', {'text-muted': !enabled}))}>{frequencies.freq2}</code>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq2', random.randomFrequency())}>
					Random
				</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq2', 0)}>Min</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq2', 1)}>Max</Button>
				<UiSlider disabled={!enabled} step={0.001} value={frequencies.freq2} onChange={v => setFrequency('freq2', v)}/>
			</div>
			<div className={(cn('mb-2', {'text-muted': !enabled}))}>
				Frequency 3: <code className={(cn('pl-2 text-size-xs', {'text-muted': !enabled}))}>{frequencies.freq3}</code>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq3', random.randomFrequency())}>
					Random
				</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq3', 0)}>Min</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq3', 1)}>Max</Button>
				<UiSlider disabled={!enabled} step={0.001} value={frequencies.freq3}
					onChange={v => setFrequency('freq3', v)}/>
			</div>
			<div className={(cn('mb-2', {'text-muted': !enabled}))}>
				Frequency 4: <code className={(cn('pl-2 text-size-xs', {'text-muted': !enabled}))}>{frequencies.freq4}</code>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq4', random.randomFrequency())}>
					Random
				</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq4', 0)}>Min</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq4', 1)}>Max</Button>
				<UiSlider disabled={!enabled} step={0.001} value={frequencies.freq4}
					onChange={v => setFrequency('freq4', v)}/>
			</div>
			<div className={(cn('mb-2', {'text-muted': !enabled}))}>
				Frequency 5: <code className={(cn('pl-2 text-size-xs', {'text-muted': !enabled}))}>{frequencies.freq5}</code>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq5', random.randomFrequency())}>
					Random
				</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq5', 0)}>Min</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq5', 1)}>Max</Button>
				<UiSlider disabled={!enabled} step={0.001} value={frequencies.freq5}
					onChange={v => setFrequency('freq5', v)}/>
			</div>
			<div className={(cn('mb-2', {'text-muted': !enabled}))}>
				Frequency 6: <code className={(cn('pl-2 text-size-xs', {'text-muted': !enabled}))}>{frequencies.freq6}</code>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq6', random.randomFrequency())}>
					Random
				</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq6', 0)}>Min</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq6', 1)}>Max</Button>
				<UiSlider disabled={!enabled} step={0.001} value={frequencies.freq6}
					onChange={v => setFrequency('freq6', v)}/>
			</div>
			<div className={(cn('mb-2', {'text-muted': !enabled}))}>
				Frequency 7: <code className={(cn('pl-2 text-size-xs', {'text-muted': !enabled}))}>{frequencies.freq7}</code>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq7', random.randomFrequency())}>
					Random
				</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq7', 0)}>Min</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq7', 1)}>Max</Button>
				<UiSlider disabled={!enabled} step={0.001} value={frequencies.freq7}
					onChange={v => setFrequency('freq7', v)}/>
			</div>
			<div className={(cn('mb-2', {'text-muted': !enabled}))}>
				Frequency 8: <code className={(cn('pl-2 text-size-xs', {'text-muted': !enabled}))}>{frequencies.freq8}</code>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq8', random.randomFrequency())}>
					Random
				</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq8', 0)}>Min</Button>
				<Button disabled={!enabled} className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq8', 1)}>Max</Button>
				<UiSlider disabled={!enabled} step={0.001} value={frequencies.freq8}
					onChange={v => setFrequency('freq8', v)}/>
			</div>
			<div className="mt-2">
				<ButtonGroup>
					<Button disabled={!enabled} variant="secondary" size="sm"
						onClick={() => {
							setFrequencies({...random.randomFrequencies(null)})
						}}>Randomize All</Button>
					<Button disabled={!enabled} variant="secondary" size="sm"
						onClick={() => {
							setFrequencies({...random.randomFrequencies(0)})
						}}>Min All</Button>
					<Button disabled={!enabled} variant="secondary" size="sm"
						onClick={() => {
							setFrequencies({...random.randomFrequencies(1)})
						}}>Max All</Button>
				</ButtonGroup>
			</div>
		</>
	);
}

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

// Default properties
NoiseAmplitudes.defaultProps = {
	enabled: true,
	frequencies: {...random.randomFrequencies(null, 3)},
	onChange: () => {},
};

export default NoiseAmplitudes;
