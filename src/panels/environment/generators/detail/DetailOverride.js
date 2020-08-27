// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-12-09
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Card, Button, Form, Accordion, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { nanoid } from 'nanoid';
import { Range } from 'rc-slider';
import cn from 'classname';

// Types
import type { Node } from 'react';

// Components
import UiSlider from './../../../../components/UiSlider';

// Utils
import * as random from './../../../../utils/random';
import * as Defaults from './../../../../utils/defaults';

type DetailAttr = {
	density_enabled?: boolean,
	density?: number,
	angle_enabled?: boolean,
	min_angle?: number,
	max_angle?: number,
	humidity_enabled?: boolean,
	min_humidity?: number,
	max_humidity?: number,
	min_altitude?: number,
	max_altitude?: number,
	_enabled: boolean,
};

type DetailSelection = {
	[string]: DetailAttr
};

/** Get randomized initial values */
const getInitialValues = (): DetailAttr => {
	let humidityRand = random.randomHumidity();
	let angleRand = random.randomAngle();
	let altitudeRand = random.randomAltitude();
	
	return {
		density_enabled: false,
		density: random.randomDensity(),
		humidity_enabled: false,
		min_humidity: humidityRand[0],
		max_humidity: humidityRand[1],
		angle_enabled: false,
		min_angle: angleRand[0],
		max_angle: angleRand[1],
		min_altitude: altitudeRand[0],
		max_altitude: altitudeRand[1],
		_enabled: true,
	};
};

/**
 * DetailOverride `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/** DetailOverride functional component */
function DetailOverride ( props: Props ): Node {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [selection, setSelection] = React.useState<DetailSelection>(props.selection);
	const [activeKey, setActiveKey] = React.useState<string>('');
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled);
		setSelection(props.selection);
	}, [props.enabled, props.selection]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), selection);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selection, enabled]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		const templateOverride: Array<string> = [];
		
		if ( !enabled ) {
			return '';
		}
		
		for ( let [name: string, attr: DetailAttr] of Object.entries(selection) ) {
			if ( !attr._enabled ) {
				continue;
			}
			
			const densityTpl: string = attr.density_enabled
				? `<density value="${attr.density}" />`
				: '';
			
			const angleTpl: string = attr.angle_enabled
				? `<min_angle value="${attr.min_angle}" /><max_angle value="${attr.max_angle}"/>`
				: '';
			
			const humidityTpl: string = attr.humidity_enabled
				? `<min_humidity value="${attr.min_humidity}" /><max_humidity value="${attr.max_humidity}"/>`
				: '';
			
			templateOverride.push(`
				<detail_override_prototype>
					<id value="${name}"/>
					${densityTpl} ${angleTpl} ${humidityTpl}
					<min_altitude value="${attr.min_altitude}" />
					<max_altitude value="${attr.max_altitude}"/>
				</detail_override_prototype>
			`);
		}
		
		if ( !templateOverride.length ) {
			return '';
		}
		
		return [
			'<detail_override_prototypes>',
			templateOverride.join(''),
			'</detail_override_prototypes>',
		].join('');
	}, [enabled, selection]);
	
	/** Get react-select options */
	const renderSelectOptions = React.useCallback((): Array<Object> => {
		const excludes: Array<string> = Object.keys(selection);
		
		return random.props
			.filter(v => !excludes.includes(v))
			.map(v => ({label: v, value: v}));
	}, [selection]);
	
	/** Update given selection name data */
	const modifySelection = ( name: string, attr: TreeAttr ): void => {
		setSelection(current => ({
			...current,
			[name]: {...(current[name] ?? {}), ...attr}
		}))
	};
	
	/** Remove existing selection */
	const removeFromSelection = ( name: string ): void => {
		setSelection(current => {
			current.hasOwnProperty(name) && (delete current[name]);
			return {...current};
		});
	};
	
	/** Generate selection based nodes */
	const selectionNodes = React.useCallback((): Array<Node> => {
		const nodes: Array<Node> = [];
		
		for ( let [name: string, attr: DetailAttr] of Object.entries(selection) ) {
			const isEnabled: boolean = attr._enabled && enabled;
			const isDensityEnabled: boolean = isEnabled && attr.density_enabled;
			const isAngleEnabled: boolean = isEnabled && attr.angle_enabled;
			const isHumidityEnabled: boolean = isEnabled && attr.humidity_enabled;
			
			nodes.push(
				<Card key={name}>
					<Card.Header className="pt-0 pb-0 pl-2 pl-2">
						<div className="clearfix">
							<div className="float-left">
								<Accordion.Toggle disabled={!enabled} as={Button}
									variant="link" eventKey={`detail_${name}`}
									onClick={() => setActiveKey(name)}>
									{name}
								</Accordion.Toggle>
							</div>
							<div className="float-right">
								<Form.Check
									disabled={!enabled}
									className="d-inline-block position-relative"
									style={{top: '6px'}}
									type="switch"
									id={`enable-detail-${name}`}
									label=""
									checked={isEnabled}
									onChange={e => modifySelection(name,{_enabled: e.target.checked})}
								/>
								{' '}
								<Button variant="link" disabled={!isEnabled}
									onClick={() => removeFromSelection(name)}
									style={{fontSize: '1.2rem', top: '1px'}}
									className="p-0 text-decoration-none position-relative text-dark" size="sm">
									&times;
								</Button>
							</div>
						</div>
					</Card.Header>
					<Accordion.Collapse eventKey={`detail_${name}`}>
						<Card.Body className="pt-2 pb-2">
							<Form.Group as={Row} className={cn('mb-2', {'text-muted': !isEnabled})}>
								<Form.Label className="text-size-sm" column={true} sm="2">
									<Form.Check
										disabled={!isEnabled}
										className="text-size-xs"
										type="switch"
										id={`switch-${nanoid(5)}`}
										label={<span style={{textDecoration: 'underline dotted'}}
											title="The amount of objects of this type to place, has to be in the range.">
											Density:
										</span>}
										checked={attr.density_enabled}
										onChange={e => modifySelection(name, {density_enabled: Boolean(e.target.checked)})}
									/>
								</Form.Label>
								<Col sm="10">
									<span className="text-size-xs font-family-code">
										Value: <code className={cn({'text-muted': !isDensityEnabled})}>{attr.density}</code>
									</span>
									<Button disabled={!isDensityEnabled}
										className="button-reset-sm" variant="link"
										onClick={() => modifySelection(name, {density: random.randomDensity()})}>
										Random
									</Button>
									<Button disabled={!isDensityEnabled}
										className="button-reset-sm" variant="link"
										onClick={() => modifySelection(name, {density: Defaults.DENSITY_DEFAULT})}>
										Reset
									</Button>
									<UiSlider disabled={!isDensityEnabled}
										step={0.01} min={Defaults.DENSITY_MIN} max={Defaults.DENSITY_MAX}
										value={Number(attr.density)} onChange={v => modifySelection(name, {density: v})}/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} className={cn('mb-2', {'text-muted': !isAngleEnabled})}>
								<Form.Label className="text-size-sm" column={true} sm="2">
									<Form.Check
										disabled={!isEnabled}
										className="text-size-xs"
										type="switch"
										id={`detail_override_angle-switch-${nanoid(5)}`}
										label={<span style={{textDecoration: 'underline dotted'}}
											title="The min and max slope angles in degrees at which this object
											is placed. Values range from 0 (flat), to 60 (very steep). Negative
											values of up to -10 are allowed to ensure you get max density at 0
											degrees, as there is a transition zone.">
											Angle:
										</span>}
										checked={attr.angle_enabled}
										onChange={e => modifySelection(name, {angle_enabled: e.target.checked})}
									/>
								</Form.Label>
								<Col sm="10">
									<div>
										<span className="text-size-xs font-family-code">
											Min: <code className={cn({'text-muted': !isAngleEnabled})}>
												{attr.min_angle}
											</code>
												{' / '}
											Max: <code className={cn({'text-muted': !isAngleEnabled})}>
												{attr.max_angle}
											</code>
										</span>
										<Button disabled={!isAngleEnabled}
											className="button-reset-sm" variant="link"
											onClick={() => {
												const [min_angle, max_angle] = random.randomAngle();
												modifySelection(name, {min_angle, max_angle});
											}}>Random</Button>
										<Button disabled={!isAngleEnabled}
											className="button-reset-sm" variant="link"
											onClick={() => modifySelection(name, {
												min_angle: Defaults.ANGLE_MIN_DEFAULT,
												max_angle: Defaults.ANGLE_MAX_DEFAULT,
											})}>Default</Button>
									</div>
									<Range
										min={Defaults.ANGLE_MIN}
										max={Defaults.ANGLE_MAX}
										disabled={!isAngleEnabled}
										value={[attr.min_angle, attr.max_angle]}
										onChange={([min_angle, max_angle]) => {
											modifySelection(name, {min_angle, max_angle});
										}}/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} className={cn('mb-2', {'text-muted': !isHumidityEnabled})}>
								<Form.Label className="text-size-sm" column={true} sm="2">
									<Form.Check
										disabled={!enabled}
										className="text-size-xs"
										type="switch"
										id={`detail_override_humidity-switch-${nanoid(5)}`}
										label={<span style={{textDecoration: 'underline dotted'}}
											title="The min and max humidity at which this detail object is placed,
											humidity is close to 1 near rivers and forests, and 0 in other places.">
											Humidity:
										</span>}
										checked={attr.humidity_enabled}
										onChange={e => modifySelection(name, {humidity_enabled: e.target.checked})}
									/>
								</Form.Label>
								<Col sm="10">
									<div>
										<span className="text-size-xs font-family-code">
											Min: <code className={cn({'text-muted': !isHumidityEnabled})}>{attr.min_humidity}</code>
											{' / '}
											Max: <code className={cn({'text-muted': !isHumidityEnabled})}>{attr.max_humidity}</code>
										</span>
										<Button disabled={!enabled || !attr.humidity_enabled}
											className="button-reset-sm" variant="link"
											onClick={() => {
												const [min_humidity, max_humidity] = random.randomHumidity();
												modifySelection(name, {min_humidity, max_humidity});
											}}>Random</Button>
										<Button disabled={!enabled || !attr.humidity_enabled}
											className="button-reset-sm" variant="link"
											onClick={() => modifySelection(name, {
												min_humidity: Defaults.HUMIDITY_MIN_DEFAULT,
												max_humidity: Defaults.HUMIDITY_MAX_DEFAULT,
											})}>Default</Button>
									</div>
									<Range
										min={Defaults.HUMIDITY_MIN}
										max={Defaults.HUMIDITY_MAX}
										step={0.01}
										disabled={!enabled || !attr.humidity_enabled}
										value={[attr.min_humidity, attr.max_humidity]}
										onChange={([min_humidity, max_humidity]) => {
											modifySelection(name, {min_humidity, max_humidity});
										}}/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
								<Form.Label className="text-size-sm" column={true} sm="2">
									<span style={{textDecoration: 'underline dotted'}}
										title="The min and max altitudes at which this object is
										placed, in meters. 0 means water level, negative values
										might make sense for certain objects like reeds or rocks
										that are placed underwater.">
											Altitude:
										</span>
								</Form.Label>
								<Col sm="10">
									<div>
										<span className="text-size-xs font-family-code">
											Min: <code className={cn({'text-muted': !isEnabled})}>{attr.min_altitude}</code>
												{' / '}
											Max: <code className={cn({'text-muted': !isEnabled})}>{attr.max_altitude}</code>
										</span>
										<Button disabled={!enabled} className="button-reset-sm" variant="link"
											onClick={() => {
												const [min_altitude, max_altitude] = random.randomAltitude();
												modifySelection(name, {min_altitude, max_altitude});
											}}>Random</Button>
										<Button disabled={!enabled} className="button-reset-sm" variant="link"
											onClick={() => modifySelection(name, {
												min_altitude: Defaults.ALTITUDE_MIN_DEFAULT,
												max_altitude: Defaults.ALTITUDE_MAX_DEFAULT,
											})}>Default</Button>
									</div>
									<Range
										min={Defaults.ALTITUDE_MIN}
										max={Defaults.ALTITUDE_MAX}
										disabled={!isEnabled}
										value={[attr.min_altitude, attr.max_altitude]}
										onChange={([min_altitude, max_altitude]) => {
											modifySelection(name, {min_altitude, max_altitude});
										}}/>
								</Col>
							</Form.Group>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			);
		}
		
		return nodes;
	}, [selection, enabled]);
	
	return (
		<Accordion>
			<Card className="mb-2">
				<Card.Header className="pt-1 pb-1 pl-2 pl-2">
					<Accordion.Toggle as={Button} variant="link" eventKey="detail_override_panel">
						Override Detail Prototypes
					</Accordion.Toggle>
				</Card.Header>
				<Accordion.Collapse eventKey="detail_override_panel">
					<Card.Body>
						<div className="mb-3">
							<Form.Check
								className="pull-right"
								type="switch"
								id={`detail_override-switch-${nanoid(5)}`}
								label="Override detail"
								checked={enabled}
								onChange={e => setEnabled(e.target.checked)}
							/>
							<div className="mt-2 mt-2">
								<Select
									isDisabled={!enabled}
									menuPortalTarget={document.body}
									styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
									options={renderSelectOptions()}
									placeholder="Choose detail to override"
									onChange={( selected: ?Object, {action}: Object ) => {
										if ( action === 'select-option' && selected ) {
											modifySelection(selected.value, getInitialValues());
											setActiveKey(selected.value);
										}
									}}
								/>
							</div>
						</div>
						<Accordion activeKey={`detail_${activeKey}`}>
							{selectionNodes()}
						</Accordion>
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
}

// Properties validation
DetailOverride.propTypes = {
	enabled: PropTypes.bool,
	selection: PropTypes.object,
	onChange: () => {},
};

// Default properties
DetailOverride.defaultProps = {
	enabled: true,
	selection: {},
	onChange: PropTypes.func,
};

export default DetailOverride;
 
