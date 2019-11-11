// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-11
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Row, Col, Button, Form, ButtonGroup } from 'react-bootstrap';
import { Range }  from 'rc-slider';
import randomFloat from 'random-float';
import randomInt from 'random-int';

// Components
import UiSlider  from './../../../../components/UiSlider';

const randFloat: ( fraction?: number ) => number
	= ( fraction: number = 2 ): number => randomFloat(0, 1).toFixed(fraction);

const defaultValues: {[string]: any} = {
	id: 'Fall',
	setup_id: 'Fall',
	duration: 0.25,
	precipitation_chance: 0.25,
	windy_chance: 0.5,
	very_windy_chance: 0.1,
	min_temperature: {
		value: 5,
	},
	max_temperature: {
		value: 25,
	},
};

/**
 * Fall `props` type
 * @type {Object}
 */
type Props = {
	enabled: boolean,
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * Fall `state` type
 * @type {Object}
 */
type State = {
	duration: number,
	precipitationChance: number,
	windyChance: number,
	veryWindyChance: number,
	minTemperatureValue: number,
	maxTemperatureValue: number,
	enabled: boolean,
};

/**
 * Fall component class
 */
export class Fall extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	constructor ( props: Props ) {
		super(props);
		this.state = {
			...this.toDefaultsValue(),
			enabled: props.enabled,
		};
	}
	
	toDefaultsValue (): {[string]: any} {
		const {
			duration, max_temperature,
			precipitation_chance, very_windy_chance,
			windy_chance, min_temperature,
		} = defaultValues;
		
		return {
			duration: duration,
			precipitationChance: precipitation_chance,
			windyChance: windy_chance,
			veryWindyChance: very_windy_chance,
			minTemperatureValue: min_temperature.value,
			maxTemperatureValue: max_temperature.value,
		};
	}
	
	/**
	 * @inheritDoc
	 */
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
		const {enabled, onChange} = this.props;
		
		if ( JSON.stringify(this.state) !== JSON.stringify(prevState) ) {
			setTimeout(() => {
				typeof onChange === 'function'
				&& onChange(this.toTemplateText(), this.getValues());
			}, 300);
		}
		
		if ( enabled !== prevProps.enabled ) {
			this.setState({enabled});
		}
	}
	
	toTemplateText (): string {
		const {enabled} = this.props;
		const {
			duration,
			precipitationChance,
			windyChance,
			veryWindyChance,
			minTemperatureValue,
			maxTemperatureValue,
		} = this.state;
		
		if ( !enabled ) {
			return '';
		}
		
		const attributes: Array<string> = [
			`id="Fall"`,
			`setup_id="Fall"`,
			`duration="${duration}"`,
			`precipitation_chance="${precipitationChance}"`,
			`windy_chance="${windyChance}"`,
			`very_windy_chance="${veryWindyChance}"`,
		];
		
		const metaTags: Array<string> = [
			`<min_temperature value="${minTemperatureValue}"/>`,
			`<max_temperature value="${maxTemperatureValue}"/>`,
		];
		
		// noinspection CheckTagEmptyBody
		return (
			`<season ${attributes.join(' ')}>`
			+ metaTags.join('')
			+`</season>`
		);
	}
	
	getValues (): {[string]: number} {
		const { value } = this.state;
		return { spring: value };
	}
	
	randomizeValues (): void {
		this.setState({
			duration: randFloat(),
			precipitationChance: randFloat(),
			windyChance: randFloat(),
			veryWindyChance: randFloat(),
			minTemperatureValue: randomInt(1, 15),
			maxTemperatureValue: randomInt(16, 35),
		});
	}
	
	render () {
		const {enabled} = this.props;
		const {
			duration,
			precipitationChance,
			windyChance,
			veryWindyChance,
			minTemperatureValue,
			maxTemperatureValue,
		} = this.state;
		
		return (
			<>
				<Form.Group as={Row} className="mb-2">
					<Form.Label className="text-size-sm" column={true} sm="2">
						Duration
					</Form.Label>
					<Col sm="10">
						<code className="text-size-xs">{Number(duration).toFixed(2)}</code>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({duration: randFloat()})}>Random</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({duration: defaultValues.duration})}>Default</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({duration: 0})}>0%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({duration: 0.25})}>25%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({duration: 0.50})}>50%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({duration: 0.75})}>75%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({duration: 1})}>100%</Button>
						<UiSlider
							disabled={!enabled}
							min={0} max={1} step={0.01}
							value={Number(duration)}
							onChange={duration => this.setState({duration})}/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-2">
					<Form.Label className="text-size-sm" column={true} sm="2">
						Precipitation Chance
					</Form.Label>
					<Col sm="10">
						<code className="text-size-xs">{Number(precipitationChance).toFixed(2)}</code>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({precipitationChance: randFloat()})}>Random</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({precipitationChance: defaultValues.precipitation_chance})}>Default</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({precipitationChance: 0})}>0%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({precipitationChance: 0.25})}>25%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({precipitationChance: 0.50})}>50%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({precipitationChance: 0.75})}>75%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({precipitationChance: 1})}>100%</Button>
						<UiSlider
							disabled={!enabled}
							min={0} max={1} step={0.01}
							value={Number(precipitationChance)}
							onChange={precipitationChance => this.setState({precipitationChance})}/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-2">
					<Form.Label className="text-size-sm" column={true} sm="2">
						Windy Chance
					</Form.Label>
					<Col sm="10">
						<code className="text-size-xs">{Number(windyChance).toFixed(2)}</code>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({windyChance: randFloat()})}>Random</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({windyChance: defaultValues.windy_chance})}>Default</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({windyChance: 0})}>0%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({windyChance: 0.25})}>25%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({windyChance: 0.50})}>50%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({windyChance: 0.75})}>75%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({windyChance: 1})}>100%</Button>
						<UiSlider
							disabled={!enabled}
							min={0} max={1} step={0.01}
							value={Number(windyChance)}
							onChange={windyChance => this.setState({windyChance})}/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-2">
					<Form.Label className="text-size-sm" column={true} sm="2">
						Very Windy Chance
					</Form.Label>
					<Col sm="10">
						<code className="text-size-xs">{Number(veryWindyChance).toFixed(2)}</code>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({veryWindyChance: randFloat()})}>Random</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({veryWindyChance: defaultValues.very_windy_chance})}>Default</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({veryWindyChance: 0})}>0%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({veryWindyChance: 0.25})}>25%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({veryWindyChance: 0.50})}>50%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({veryWindyChance: 0.75})}>75%</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({veryWindyChance: 1})}>100%</Button>
						<UiSlider
							disabled={!enabled}
							min={0} max={1} step={0.01}
							value={Number(veryWindyChance)}
							onChange={veryWindyChance => this.setState({veryWindyChance})}/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-2">
					<Form.Label className="text-size-sm" column={true} sm="2">
						Temperature
					</Form.Label>
					<Col sm="10">
								<span className="text-size-xs font-family-code">
									Min: <code>{minTemperatureValue}</code>
									{' / '}
									Max: <code>{maxTemperatureValue}</code>
								</span>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({
								minTemperatureValue: randomInt(1, 15),
								maxTemperatureValue: randomInt(16, 35),
							})}>Random</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => this.setState({
								minTemperatureValue: defaultValues.min_temperature.value,
								maxTemperatureValue: defaultValues.max_temperature.value,
							})}>Default</Button>
						<Range
							min={1}
							max={35}
							disabled={!enabled}
							value={[minTemperatureValue, maxTemperatureValue]}
							onChange={([min, max]) => {
								this.setState({
									minTemperatureValue: min,
									maxTemperatureValue: max,
								});
							}}/>
					</Col>
				</Form.Group>
				<div className="mt-3">
					<ButtonGroup>
						<Button disabled={!enabled} variant="secondary" size="sm"
							onClick={this.randomizeValues.bind(this)}>Randomize All</Button>
						<Button disabled={!enabled} variant="secondary" size="sm"
							onClick={() => this.setState({...this.toDefaultsValue()})}>
							Set Defaults
						</Button>
					</ButtonGroup>
				</div>
			</>
		);
	};
}

// Properties validation
Fall.propTypes = {
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

// Default properties
Fall.defaultProps = {
	enabled: true,
	onChange: () => {},
};

export default Fall;
