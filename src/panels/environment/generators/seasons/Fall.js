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
import cn from 'classname';

// Components
import * as random from './../../../../utils/random';
import * as Defaults from './../../../../utils/defaults';

// Components
import UiSlider  from './../../../../components/UiSlider';

const defaultValues = {
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

type SeasonValue = {
	duration: number,
	precipitationChance: number,
	windyChance: number,
	veryWindyChance: number,
	minTemperatureValue: number,
	maxTemperatureValue: number,
}

/**
 * Fall `props` type
 * @type {Object}
 */
type Props = {
	enabled?: boolean,
	season?: SeasonValue,
	onChange ( template: string, values?: {[string]: any} ): void,
};

/** Fall functional component */
function Fall ( props: Props ) {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [season, setSeason] = React.useState<SeasonValue>(props.season);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled);
		setSeason(props.season);
	}, [props.enabled, props.season]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), season);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [season, enabled]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return enabled ? (
			`<season id="Fall" setup_id="Fall"
				duration="${season.duration}"
				precipitation_chance="${season.precipitationChance}"
				windy_chance="${season.windyChance}"
				very_windy_chance="${season.veryWindyChance}">
					<min_temperature value="${season.minTemperatureValue}"/>
					<max_temperature value="${season.maxTemperatureValue}"/>
			</season>`
		): '';
	}, [season, enabled]);
	
	/** Randomize season values */
	const randomizeValues = (): void => {
		const [minTemperatureValue, maxTemperatureValue] = random.randomSeasonTemperature();
		setSeason({
			duration: random.randomFloat(),
			precipitationChance: random.randomFloat(),
			windyChance: random.randomFloat(),
			veryWindyChance: random.randomFloat(),
			minTemperatureValue,
			maxTemperatureValue,
		});
	}
	
	/** Update season */
	const updateValue = ( name: string, value: any ): void => {
		setSeason(current => ({
			...current,
			[name]: value
		}));
	};
	
	/** Update season */
	const setValuesDefault = (): void => {
		setSeason({
			duration: defaultValues.duration,
			precipitationChance: defaultValues.precipitation_chance,
			windyChance: defaultValues.windy_chance,
			veryWindyChance: defaultValues.very_windy_chance,
			minTemperatureValue: defaultValues.min_temperature.value,
			maxTemperatureValue: defaultValues.max_temperature.value,
		});
	};
	
	return (
		<>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
						title="How long this season is, in terms of a fraction of a
						year, all season durations have to add up to 1.">
						Duration
					</span>
				</Form.Label>
				<Col sm="10">
					<code className={cn('text-size-xs', {'text-muted': !enabled})}>{season.duration}</code>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('duration', random.randomFloat())}>Random</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('duration', defaultValues.duration)}>Default</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('duration', 0)}>%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('duration', 0.25)}>25%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('duration' ,0.50)}>50%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('duration' ,0.75)}>75%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('duration' ,1)}>100%</Button>
					<UiSlider
						disabled={!enabled}
						min={0} max={1} step={0.01}
						value={season.duration}
						onChange={v => updateValue('duration' ,v)}/>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
						title="How likely it is to rain/snow in this season.">
						Precipitation Chance
					</span>
				</Form.Label>
				<Col sm="10">
					<code className={cn('text-size-xs', {'text-muted': !enabled})}>{season.precipitationChance}</code>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('precipitationChance', random.randomFloat())}>Random</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('precipitationChance', defaultValues.precipitation_chance)}>Default</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('precipitationChance', 0)}>0%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('precipitationChance', 0.25)}>25%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('precipitationChance', 0.50)}>50%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('precipitationChance', 0.75)}>75%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('precipitationChance', 1)}>100%</Button>
					<UiSlider
						disabled={!enabled}
						min={0} max={1} step={0.01}
						value={season.precipitationChance}
						onChange={v => updateValue('precipitationChance' ,v)}/>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
						title="How likely it is for it to be windy in this season.">
						Windy Chance
					</span>
				</Form.Label>
				<Col sm="10">
					<code className={cn('text-size-xs', {'text-muted': !enabled})}>{season.windyChance}</code>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('windyChance', random.randomFloat())}>Random</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('windyChance', defaultValues.windy_chance)}>Default</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('windyChance', 0.0)}>0%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('windyChance', 0.25)}>25%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('windyChance', 0.50)}>50%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('windyChance', 0.75)}>75%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('windyChance', 1.0)}>100%</Button>
					<UiSlider
						disabled={!enabled}
						min={0} max={1} step={0.01}
						value={season.windyChance}
						onChange={v => updateValue('windyChance', v)}/>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
						title="How likely it is for it to be very windy in this season.">
						Very Windy Chance
					</span>
				</Form.Label>
				<Col sm="10">
					<code className={cn('text-size-xs', {'text-muted': !enabled})}>{season.veryWindyChance}</code>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('veryWindyChance', random.randomFloat())}>Random</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('veryWindyChance', defaultValues.very_windy_chance)}>Default</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('veryWindyChance', 0)}>0%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('veryWindyChance', 0.25)}>25%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('veryWindyChance', 0.50)}>50%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('veryWindyChance', 0.75)}>75%</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => updateValue('veryWindyChance', 1)}>100%</Button>
					<UiSlider
						disabled={!enabled}
						min={0} max={1} step={0.01}
						value={season.veryWindyChance}
						onChange={n => updateValue('veryWindyChance', n)}/>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">
					<span style={{textDecoration: 'underline dotted'}}
						title="Temperature will randomly oscillate between these 2 values (in Celsius)">
						Temperature
					</span>
				</Form.Label>
				<Col sm="10">
					<span className="text-size-xs font-family-code">
						Min: <code className={cn({'text-muted': !enabled})}>{season.minTemperatureValue}°</code>
						{' / '}
						Max: <code className={cn({'text-muted': !enabled})}>{season.maxTemperatureValue}°</code>
					</span>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => {
							const [min, max] = random.randomSeasonTemperature();
							updateValue('minTemperatureValue', min);
							updateValue('maxTemperatureValue', max);
						}}>Random</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
						onClick={() => {
							updateValue('minTemperatureValue', defaultValues.min_temperature.value);
							updateValue('maxTemperatureValue', defaultValues.max_temperature.value);
						}}>Default</Button>
					<Range
						min={Defaults.SEASON_TEMPERATURE_MIN}
						max={Defaults.SEASON_TEMPERATURE_MAX}
						disabled={!enabled}
						value={[season.minTemperatureValue, season.maxTemperatureValue]}
						onChange={([min, max]) => {
							updateValue('minTemperatureValue', min);
							updateValue('maxTemperatureValue', max);
						}}/>
				</Col>
			</Form.Group>
			<div className="mt-3">
				<ButtonGroup>
					<Button disabled={!enabled} variant="secondary" size="sm"
						onClick={() => randomizeValues()}>Randomize All</Button>
					<Button disabled={!enabled} variant="secondary" size="sm"
						onClick={() => setValuesDefault()}>
						Set Defaults
					</Button>
				</ButtonGroup>
			</div>
		</>
	);
}

// Properties validation
Fall.propTypes = {
	enabled: PropTypes.bool,
	season: PropTypes.shape({
		duration: PropTypes.number,
		precipitationChance: PropTypes.number,
		windyChance: PropTypes.number,
		veryWindyChance: PropTypes.number,
		minTemperatureValue: PropTypes.number,
		maxTemperatureValue: PropTypes.number,
	}),
	onChange: PropTypes.func,
};

// Default properties
Fall.defaultProps = {
	enabled: true,
	season: {
		duration: defaultValues.duration,
		precipitationChance: defaultValues.precipitation_chance,
		windyChance: defaultValues.windy_chance,
		veryWindyChance: defaultValues.very_windy_chance,
		minTemperatureValue: defaultValues.min_temperature.value,
		maxTemperatureValue: defaultValues.max_temperature.value,
	},
	onChange: () => {},
};

export default Fall;
