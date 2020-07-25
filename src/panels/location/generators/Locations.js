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

// Utils
import * as random from '../../../utils/random';

// Components
import UiSlider from './../../../components/UiSlider';

export type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * Locations `state` type
 * @type {Object}
 */
type State = {
	cordNorth: string,
	cordSouth: string,
	name: string,
	seed: string,
	river: boolean,
	environment: string,
	lakes: number,
	init: false,
};

/**
 * Locations stateful component
 */
class Locations extends React.Component<Props, State> {
	state: State = {
		cordNorth: random.randomCord(),
		cordSouth: random.randomCord(),
		name: random.randomName(),
		seed: random.randomSeed(),
		river: random.randomRiver(),
		environment: random.randomEnvironment(),
		lakes: random.randomLakes(),
		init: false,
	};
	
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
	
	randomizeCords (): void {
		this.setState({
			cordNorth: random.randomCord(),
			cordSouth: random.randomCord(),
		});
	}
	
	randomizeName (): void {
		this.setState({name: random.randomName()});
	}
	
	randomizeSeed (): void {
		this.setState({seed: random.randomSeed()});
	}
	
	randomizeEnvironment (): void {
		this.setState({environment: random.randomEnvironment()});
	}
	
	randomizeLakes (): void {
		this.setState({lakes: random.randomLakes()});
	}
	
	randomizeRiver (): void {
		this.setState({river: random.randomRiver()});
	}
	
	randomizeValues (): void {
		this.randomizeCords();
		this.randomizeName();
		this.randomizeSeed();
		this.randomizeEnvironment();
		this.randomizeLakes();
		this.randomizeRiver();
	}
	
	toTemplateText (): string {
		const {
			cordNorth, cordSouth,
			name, seed, river,
			environment, lakes,
		} = this.state;
		
		const riverProp = ` river="${river ? 'true' : 'false'}"`;
		const lakesProp = Number(lakes) ? ` lakes="${lakes}"` : '';
		const optionals = `${riverProp}${lakesProp}`;
		
		return `<location id="${name}" seed="${seed}"`
			+ ` environment="${environment}"`
			+ ` map_location="${cordNorth},${cordSouth}"`
			+ `${optionals}`
			+ `/>`;
	}
	
	getValues (): {[string]: any } {
		const {
			cordNorth, cordSouth,
			name, seed, river,
			environment, lakes,
		} = this.state;
		
		return {
			cordNorth, cordSouth,
			name, seed, river,
			environment, lakes,
		};
	}
	
	/**
	 * @inheritDoc
	 */
	render (): Node {
		const {
			cordNorth, cordSouth, name, seed,
			river, environment, lakes,
		} = this.state;
		
		return (
			<>
				<Form.Group as={Row} className="mb-2">
					<Form.Label className="text-size-sm" column={true} sm="2">Name</Form.Label>
					<Col sm="10">
						<InputGroup>
							<Form.Control
								value={name} size="sm" className="d-inline-block position-relative"
								maxLength={40} style={{maxWidth:'280px'}} onChange={e => {
								this.setState({name: slugify(e.target.value, '_')});
							}} />
							<InputGroup.Append>
								<Button variant="secondary" className="mt-xs-1" size="sm"
									onClick={this.randomizeName.bind(this)}>Randomize</Button>
							</InputGroup.Append>
						</InputGroup>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-2">
					<Form.Label className="text-size-sm" column={true} sm="2">Seed</Form.Label>
					<Col sm="10">
						<InputGroup>
							<Form.Control
								value={seed} size="sm" className="d-inline-block position-relative"
								maxLength={8} style={{maxWidth:'140px'}} onChange={e => {
								this.setState({seed: e.target.value.padStart(8, '0')});
							}} onKeyUp={e => {
								e.target.value = String(e.target.value).replace(/\D+/, '');
							}} />
							{' '}
							<InputGroup.Append>
								<Button variant="secondary" size="sm"
									onClick={this.randomizeSeed.bind(this)}>Randomize</Button>
								<Button variant="secondary" size="sm"
									onClick={() => this.setState({seed: '11111111'})}>1x8</Button>
								<Button variant="secondary" size="sm"
									onClick={() => this.setState({seed: '00000000'})}>Reset</Button>
							</InputGroup.Append>
						</InputGroup>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-2">
					<Form.Label className="text-size-sm" column={true} sm="2">Environment</Form.Label>
					<Col sm="10">
						<InputGroup>
							<Form.Control
								value={environment} size="sm"
								className="d-inline-block position-relative"
								maxLength={40} style={{maxWidth:'300px'}} onChange={e => {
								this.setState({environment: slugify(e.target.value, '_')});
							}} />
							<InputGroup.Append>
								<Button variant="secondary" size="sm"
									onClick={this.randomizeEnvironment.bind(this)}>Randomize</Button>
							</InputGroup.Append>
						</InputGroup>
						<ul className="list-unstyled list-inline mb-0">
							{random.environments.map((v: string, i: number) => (
								<li className="list-inline-item text-size-xxs" key={`environment_key_${i}`}>
									<a href="/" data-value={v} onClick={e => {
										e.preventDefault();
										this.setState({environment: e.target.getAttribute('data-value')});
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
							North: <code className="pl-2 text-size-xs">{cordNorth}</code>
							<Button className="button-reset-sm" variant="link"
								onClick={() => this.setState({cordNorth: random.randomCord()})}>Random</Button>
							<Button className="button-reset-sm" variant="link"
								onClick={() => this.setState({cordNorth: 0})}>Reset</Button>
							<UiSlider
								value={Number(cordNorth)}
								onChange={cordNorth => this.setState({cordNorth})}/>
						</div>
						<div className="mb-2 text-size-xs">
							South: <code className="pl-2 text-size-xs">{cordSouth}</code>
							<Button className="button-reset-sm" variant="link"
								onClick={() => this.setState({cordSouth: random.randomCord()})}>Random</Button>
							<Button className="button-reset-sm" variant="link"
								onClick={() => this.setState({cordSouth: 0})}>Reset</Button>
							<UiSlider
								value={Number(cordSouth)}
								onChange={cordSouth => this.setState({cordSouth})}/>
						</div>
						<div className="mt-2">
							<ButtonGroup aria-label="Basic example">
								<Button variant="secondary" size="sm"
									onClick={this.randomizeCords.bind(this)}>Randomize</Button>
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
							checked={river}
							onChange={e => this.setState({river: Boolean(e.target.checked)})}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-2">
					<Form.Label className="text-size-sm" column={true} sm="2">Lakes</Form.Label>
					<Col sm="10">
						<InputGroup>
							<Form.Control
								value={lakes} size="sm" className="d-inline-block position-relative"
								maxLength={1} style={{maxWidth:'60px'}} onChange={e => {
								this.setState({lakes: e.target.value});
							}} onKeyUp={e => {
								e.target.value = Number(String(e.target.value).replace(/\D+/, '')) || 0;
							}} />
							<InputGroup.Append>
								<Button variant="secondary" size="sm"
									onClick={this.randomizeLakes.bind(this)}>Randomize</Button>
								<Button variant="secondary" size="sm"
									onClick={() => this.setState({lakes: 0})}>None</Button>
							</InputGroup.Append>
						</InputGroup>
					</Col>
				</Form.Group>
				<hr/>
				<div className="mt-2">
					<ButtonGroup>
						<Button variant="secondary" size="sm"
							onClick={this.randomizeValues.bind(this)}>Randomize All</Button>
					</ButtonGroup>
				</div>
			</>
		);
	}
}

Locations.defaultProps = {
	onChange: () => {},
};

Locations.propTypes = {
	onChange: PropTypes.func,
};

export default Locations;
 
