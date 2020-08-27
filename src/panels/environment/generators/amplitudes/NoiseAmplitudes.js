// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'react-bootstrap';

// Components
import UiSlider from './../../../../components/UiSlider';

// Utils
import * as random from '../../../../utils/random';

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
	frequencies?: ValueFrequencies,
	onChange ( template: string, values: ValueFrequencies ): void,
};

/** NoiseAmplitudes functional component */
function NoiseAmplitudes ( props: Props ) {
	const [frequencies, setFrequencies] = React.useState<ValueFrequencies>(props.frequencies);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setFrequencies({...props.frequencies});
	}, [props.frequencies]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), frequencies);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [frequencies]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		const values: string = Object.values(frequencies)
			.map(c => Number(c).toFixed(3))
			.join(' ');
		return `<noise_amplitudes values="${values}"/>`;
	}, [frequencies]);
	
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
			</div>
			<div className="mb-2">
				Frequency 1: <code className="pl-2 text-size-xs">{frequencies.freq1.toFixed(3)}</code>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq1', random.randomFrequency())}>
					Random
				</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq1', 0)}>Min</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq1', 1)}>Max</Button>
				<UiSlider step={0.001} value={frequencies.freq1.toFixed(3)} onChange={v => setFrequency('freq1', v)}/>
			</div>
			<div className="mb-2">
				Frequency 2: <code className="pl-2 text-size-xs">{frequencies.freq2.toFixed(3)}</code>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq2', random.randomFrequency())}>
					Random
				</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq2', 0)}>Min</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq2', 1)}>Max</Button>
				<UiSlider step={0.001} value={frequencies.freq2} onChange={v => setFrequency('freq2', v)}/>
			</div>
			<div className="mb-2">
				Frequency 3: <code className="pl-2 text-size-xs">{frequencies.freq3}</code>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq3', random.randomFrequency())}>
					Random
				</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq3', 0)}>Min</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq3', 1)}>Max</Button>
				<UiSlider step={0.001} value={frequencies.freq3}
					onChange={v => setFrequency('freq3', v)}/>
			</div>
			<div className="mb-2">
				Frequency 4: <code className="pl-2 text-size-xs">{frequencies.freq4}</code>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq4', random.randomFrequency())}>
					Random
				</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq4', 0)}>Min</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq4', 1)}>Max</Button>
				<UiSlider step={0.001} value={frequencies.freq4}
					onChange={v => setFrequency('freq4', v)}/>
			</div>
			<div className="mb-2">
				Frequency 5: <code className="pl-2 text-size-xs">{frequencies.freq5}</code>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq5', random.randomFrequency())}>
					Random
				</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq5', 0)}>Min</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq5', 1)}>Max</Button>
				<UiSlider step={0.001} value={frequencies.freq5}
					onChange={v => setFrequency('freq5', v)}/>
			</div>
			<div className="mb-2">
				Frequency 6: <code className="pl-2 text-size-xs">{frequencies.freq6}</code>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq6', random.randomFrequency())}>
					Random
				</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq6', 0)}>Min</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq6', 1)}>Max</Button>
				<UiSlider step={0.001} value={frequencies.freq6}
					onChange={v => setFrequency('freq6', v)}/>
			</div>
			<div className="mb-2">
				Frequency 7: <code className="pl-2 text-size-xs">{frequencies.freq7}</code>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq7', random.randomFrequency())}>
					Random
				</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq7', 0)}>Min</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq7', 1)}>Max</Button>
				<UiSlider step={0.001} value={frequencies.freq7}
					onChange={v => setFrequency('freq7', v)}/>
			</div>
			<div className="mb-2">
				Frequency 8: <code className="pl-2 text-size-xs">{frequencies.freq8}</code>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq8', random.randomFrequency())}>
					Random
				</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq8', 0)}>Min</Button>
				<Button className="button-reset-sm" variant="link"
					onClick={() => setFrequency('freq8', 1)}>Max</Button>
				<UiSlider step={0.001} value={frequencies.freq8}
					onChange={v => setFrequency('freq8', v)}/>
			</div>
			<div className="mt-2">
				<ButtonGroup>
					<Button variant="secondary" size="sm"
						onClick={() => {
							setFrequencies({...random.randomFrequencies(null)})
						}}>Randomize All</Button>
					<Button variant="secondary" size="sm"
						onClick={() => {
							setFrequencies({...random.randomFrequencies(0)})
						}}>Min All</Button>
					<Button variant="secondary" size="sm"
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
	frequencies: {...random.randomFrequencies(null, 3)},
	onChange: () => {},
};

export default NoiseAmplitudes;
