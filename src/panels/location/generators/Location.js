// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-09
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Form, Row, Col, Button, ButtonGroup, InputGroup } from 'react-bootstrap';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

// Types
import type { Node } from 'react';
import type { LocationProps } from './../../../utils/location';

// Components
import UiSlider from './../../../components/UiSlider';

// Utils
import * as location from './../../../utils/location';

export type Props = {
	values?: LocationProps,
	onChange ( template: string, values: LocationProps ): void,
};

/** Location functional component */
function Location ( props: Props ): Node {
	const [values, setValues] = React.useState<LocationProps>(props.values);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), values);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		const {name, seed, coordinates, river, environment, lakes} = values;
		
		const riverProp: string = ` river="${river ? 'true' : 'false'}"`;
		const lakesProp: string = Number(lakes) ? ` lakes="${lakes}"` : '';
		
		return (
			`<location id="${name}"
				seed="${String(seed).padStart(8, '0')}"
				environment="${environment}"
				map_location="${coordinates[0]},${coordinates[1]}"
				${riverProp} ${lakesProp}
				/>`
		);
	}, [values]);
	
	/** Update given value by name */
	const updateValue = ( name: string, value: any ): void => {
		setValues(current => ({
			...current,
			[name]: value,
		}))
	};
	
	/** Update coordinate */
	const updateCoordinate = ( north: number = null, south: number = null ): void => {
		const [n, s] = values.coordinates;
		
		updateValue('coordinates', [
			north ?? n,
			south ?? s,
		]);
	};
	
	return (
		<>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">Name</Form.Label>
				<Col sm="10">
					<InputGroup>
						<Form.Control
							value={values.name} size="sm" className="d-inline-block position-relative"
							maxLength={40} style={{maxWidth:'280px'}} onChange={e => {
							updateValue('name', slugify(e.target.value, '_'));
						}} />
						<InputGroup.Append>
							<Button variant="secondary" className="mt-xs-1" size="sm"
								onClick={() => {
									updateValue('name', location.randomName().slug)
								}}>Randomize</Button>
						</InputGroup.Append>
					</InputGroup>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">Seed</Form.Label>
				<Col sm="10">
					<InputGroup>
						<Form.Control
							value={values.seed} size="sm" className="d-inline-block position-relative"
							maxLength={8} style={{maxWidth:'140px'}} onChange={e => {
							if ( e.target.value === '' || /^[0-9\b]+$/.test(e.target.value) ) {
								updateValue('seed', Number(e.target.value));
							}
						}} />
						{' '}
						<InputGroup.Append>
							<Button variant="secondary" size="sm"
								onClick={() => updateValue('seed', location.randomSeed())}>Randomize</Button>
							<Button variant="secondary" size="sm"
								onClick={() => updateValue('seed', '11111111')}>1x8</Button>
							<Button variant="secondary" size="sm"
								onClick={() => updateValue('seed', '00000000')}>Reset</Button>
						</InputGroup.Append>
					</InputGroup>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">Environment</Form.Label>
				<Col sm="10">
					<InputGroup>
						<Form.Control
							value={values.environment} size="sm"
							className="d-inline-block position-relative"
							maxLength={40} style={{maxWidth:'300px'}} onChange={e => {
							updateValue('environment', slugify(e.target.value, '_'));
						}} />
						<InputGroup.Append>
							<Button variant="secondary" size="sm"
								onClick={() => {
									updateValue('environment', location.randomEnvironment());
								}}>Randomize</Button>
						</InputGroup.Append>
					</InputGroup>
					<ul className="list-unstyled list-inline mb-0">
						{location.environments.map((v: string, i: number) => (
							<li className="list-inline-item text-size-xxs" key={`environment_key_${i}`}>
								<a href="/" data-value={v} onClick={e => {
									e.preventDefault();
									updateValue('environment', e.target.getAttribute('data-value'));
								}}>{v}</a>
							</li>
						))}
					</ul>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">Map Location</Form.Label>
				<Col sm="10">
					<div className="mb-2 text-size-xs">
						North: <code className="pl-2 text-size-xs">{values.coordinates[0]}</code>
						<Button className="button-reset-sm" variant="link"
							onClick={() => updateCoordinate(location.randomCoordinate())}>Random</Button>
						<Button className="button-reset-sm" variant="link"
							onClick={() => updateCoordinate(0)}>Reset</Button>
						<UiSlider step={0.01}
							value={values.coordinates[0]}
							onChange={v => updateCoordinate(Number(v))}/>
					</div>
					<div className="mb-2 text-size-xs">
						South: <code className="pl-2 text-size-xs">{values.coordinates[1]}</code>
						<Button className="button-reset-sm" variant="link"
							onClick={() => updateCoordinate(null, location.randomCoordinate())}>Random</Button>
						<Button className="button-reset-sm" variant="link"
							onClick={() => updateCoordinate(null, 0)}>Reset</Button>
						<UiSlider step={0.01}
							value={values.coordinates[1]}
							onChange={v => updateCoordinate(null, Number(v))}/>
					</div>
					<div className="mt-2">
						<ButtonGroup aria-label="Basic example">
							<Button variant="secondary" size="sm"
								onClick={() => updateValue('coordinates', location.randomCoordinates())}>Randomize</Button>
						</ButtonGroup>
					</div>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">River</Form.Label>
				<Col sm="10">
					<Form.Check
						style={{top: '7px'}}
						className="position-relative"
						type="switch"
						id={`river-switch-${nanoid(5)}`}
						label=""
						checked={values.river}
						onChange={e => updateValue('river', e.target.checked)}
					/>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label className="text-size-sm" column={true} sm="2">Lakes</Form.Label>
				<Col sm="10">
					<InputGroup>
						<Form.Control
							value={values.lakes} size="sm" className="d-inline-block position-relative"
							maxLength={1} style={{maxWidth:'60px'}} onChange={e => {
							updateValue('lakes', Number(e.target.value))
						}} onKeyUp={e => {
							e.target.value = Number(String(e.target.value).replace(/\D+/, '')) || 0;
						}} />
						<InputGroup.Append>
							<Button variant="secondary" size="sm"
								onClick={() => {
									updateValue('lakes', location.randomLakes());
								}}>Randomize</Button>
							<Button variant="secondary" size="sm"
								onClick={() => updateValue('lakes', 0)}>None</Button>
						</InputGroup.Append>
					</InputGroup>
				</Col>
			</Form.Group>
			<hr/>
			<div className="mt-2">
				<ButtonGroup>
					<Button variant="secondary" size="sm"
						onClick={() => setValues(location.randomizeLocation())}>Randomize All</Button>
				</ButtonGroup>
			</div>
		</>
	);
}

// Properties validation
Location.propTypes = {
	values: PropTypes.shape({
		name: PropTypes.string,
		seed: PropTypes.string,
		coordinates: PropTypes.arrayOf(PropTypes.string, 2),
		river: PropTypes.bool,
		environment: PropTypes.string,
		lakes: PropTypes.number,
	}),
	onChange: PropTypes.func,
};

// Default properties
Location.defaultProps = {
	values: location.randomizeLocation(),
	onChange: () => {},
};

export default Location;
 
