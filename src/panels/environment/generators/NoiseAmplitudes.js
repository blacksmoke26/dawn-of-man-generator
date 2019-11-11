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
import UiSlider from './../../../components/UiSlider';

// Utils
import * as random from '../../../utils/random';

/**
 * NoiseAmplitudes `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * NoiseAmplitudes `state` type
 * @type {Object}
 */
type State = {
	freq1: number, freq2: number, freq3: number, freq4: number,
	freq5: number, freq6: number, freq7: number, freq8: number,
};

const fraction: number = 3;

/**
 * NoiseAmplitudes component class
 */
export class NoiseAmplitudes extends React.Component<Props, State> {
	state: State = {
		...random.randomFrequencies(null, fraction)
	};
	
	randomizeValues (): void {
		this.setState({
			...random.randomFrequencies(null, fraction)
		});
	}
	
	resetValues (): void {
		this.setState({
			...random.randomFrequencies(0, fraction)
		});
	}
	
	componentDidMount (): void {
		const {onChange} = this.props;
		setTimeout(() => {
			typeof onChange === 'function'
				&& onChange(this.toTemplateText(), this.getValues());
		}, 300);
	}
	
	/**
	 * @inheritDoc
	 */
	componentDidUpdate ( prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS ): void {
		if ( JSON.stringify(this.state) !== JSON.stringify(prevState) ) {
			const {onChange} = this.props;
			
			setTimeout(() => {
				typeof onChange === 'function'
				&& onChange(this.toTemplateText(), this.getValues());
			}, 300);
		}
	}
	
	toTemplateText (): string {
		const {
			freq1, freq2, freq3, freq4,
			freq5, freq6, freq7, freq8,
		} = this.state;
		
		const values: string = [
			freq1, freq2, freq3,
			freq4, freq5, freq6,
			freq7, freq8,
		].join(' ');
		
		return `<noise_amplitudes values="${values}"/>`;
	}
	
	getValues (): {[string]: number} {
		const {
			freq1, freq2, freq3, freq4,
			freq5, freq6, freq7, freq8,
		} = this.state;
		
		return {
			freq1, freq2, freq3, freq4,
			freq5, freq6, freq7, freq8,
		};
	}
	
	render () {
		const {
			freq1, freq2, freq3, freq4,
			freq5, freq6, freq7, freq8,
		} = this.state;
		
		return (
			<>
				<div className="text-size-xxs text-muted mb-1">
					Modify the amplitudes of the different noise layers, the initial numbers
					define the amplitudes of the low-frequencies (the height of large mountains), and the later
					numbers define the amplitudes of the high_frequencies (the height of the small bumps).
				</div>
				<div className="mb-2">
					Trees und flint south: <code className="pl-2 text-size-xs">{freq1}</code>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq1: random.randomFrequency(fraction)})}>
						Random
					</Button>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq1: 0})}>Reset</Button>
					<UiSlider value={Number(freq1)} onChange={v => this.setState({freq1: v})}/>
				</div>
				<div className="mb-2">
					Trees und flint north: <code className="pl-2 text-size-xs">{freq2}</code>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq2: random.randomFrequency(fraction)})}>
						Random
					</Button>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq2: 0})}>Reset</Button>
					<UiSlider value={Number(freq2)} onChange={v => this.setState({freq2: v})}/>
				</div>
				<div className="mb-2">
					Hills and monolith: <code className="pl-2 text-size-xs">{freq3}</code>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq3: random.randomFrequency(fraction)})}>
						Random
					</Button>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq3: 0})}>Reset</Button>
					<UiSlider value={Number(freq3)} onChange={v => this.setState({freq3: v})}/>
				</div>
				<div className="mb-2">
					Trees near the river: <code className="pl-2 text-size-xs">{freq4}</code>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq4: random.randomFrequency(fraction)})}>
						Random
					</Button>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq4: 0})}>Reset</Button>
					<UiSlider value={Number(freq4)} onChange={v => this.setState({freq4: v})}/>
				</div>
				<div className="mb-2">
					Stones: <code className="pl-2 text-size-xs">{freq5}</code>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq5: random.randomFrequency(fraction)})}>
						Random
					</Button>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq5: 0})}>Reset</Button>
					<UiSlider value={Number(freq5)} onChange={v => this.setState({freq5: v})}/>
				</div>
				<div className="mb-2">
					Mountains: <code className="pl-2 text-size-xs">{freq6}</code>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq6: random.randomFrequency(fraction)})}>
						Random
					</Button>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq6: 0})}>Reset</Button>
					<UiSlider value={Number(freq6)} onChange={v => this.setState({freq6: v})}/>
				</div>
				<div className="mb-2">
					Mountains: <code className="pl-2 text-size-xs">{freq7}</code>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq7: random.randomFrequency(fraction)})}>
						Random
					</Button>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq7: 0})}>Reset</Button>
					<UiSlider value={Number(freq7)} onChange={v => this.setState({freq7: v})}/>
				</div>
				<div className="mb-2">
					Metal?: <code className="pl-2 text-size-xs">{freq8}</code>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq8: random.randomFrequency(fraction)})}>
						Random
					</Button>
					<Button className="button-reset-sm" variant="link"
						onClick={() => this.setState({freq8: 0})}>Reset</Button>
					<UiSlider value={Number(freq8)} onChange={v => this.setState({freq8: v})}/>
				</div>
				<div className="mt-2">
					<ButtonGroup>
						<Button variant="secondary" size="sm"
							onClick={this.randomizeValues.bind(this)}>Randomize All</Button>
						<Button variant="secondary" size="sm"
							onClick={this.resetValues.bind(this)}>Reset All</Button>
					</ButtonGroup>
				</div>
			</>
		);
	};
}

// Properties validation
NoiseAmplitudes.defaultProps = {
	onChange: () => {},
};

// Default properties
NoiseAmplitudes.propTypes = {
	onChange: PropTypes.func,
};

export default NoiseAmplitudes;
