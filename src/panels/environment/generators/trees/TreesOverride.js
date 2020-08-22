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

// Components
import UiSlider from './../../../../components/UiSlider';

// Utils
import * as random from './../../../../utils/random';
import * as Defaults from './../../../../utils/defaults';
import cn from 'classname';

type TreeAttr = {
	density_enabled?: boolean,
	density?: number,
	angle_enabled?: boolean,
	min_angle?: number,
	max_angle?: number,
	min_altitude?: number,
	max_altitude?: number,
	_enabled: boolean,
};

type TreeSelection = {
	[string]: TreeAttr
};

const getInitialValues = (): TreeAttr => {
	let angleRand = random.randomAngle();
	let altitudeRand = random.randomAltitude();
	
	return {
		density_enabled: false,
		density: random.randomDensity(),
		angle_enabled: false,
		min_angle: angleRand[0],
		max_angle: angleRand[1],
		min_altitude: altitudeRand[0],
		max_altitude: altitudeRand[1],
		_enabled: true,
	};
};

/**
 * TreesOverride `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * TreesOverride `state` type
 * @type {Object}
 */
type State = {
	override: boolean,
	selection: TreeSelection,
	activeKey: string,
};

/**
 * TreesOverride component class
 */
export class TreesOverride extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		override: true,
		selection: {},
		activeKey: '',
	};
	
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
		if ( JSON.stringify(this.state) !== JSON.stringify(prevState) ) {
			const {onChange} = this.props;
			
			setTimeout(() => {
				typeof onChange === 'function'
				&& onChange(this.toTemplateText(), this.getValues());
			}, 300);
		}
	}
	
	toTemplateText (): string {
		const { override, selection } = this.state;
		
		const templateOverride: Array<string> = [];
		
		if ( !override ) {
			return '';
		}
		
		for ( let [name: string, attr: TreeAttr] of Object.entries(selection) ) {
			if ( !attr._enabled ) {
				continue;
			}
			
			 const densityTpl: string = attr.density_enabled
			 	? `<density value="${attr.density}" />`
			 	: '';
			
			 const angleTpl: string = attr.angle_enabled
			 	? `<min_angle value="${attr.min_angle}" /><max_angle value="${attr.max_angle}"/>`
			 	: '';
			
			templateOverride.push(
				'<tree_override_prototype>'
				+ `<id value="${name}"/>`
				+ densityTpl
				+ angleTpl
				+ `<min_altitude value="${attr.min_altitude}" />`
				+ `<max_altitude value="${attr.max_altitude}"/>`
				+ '</tree_override_prototype>'
			);
		}
		
		if ( !templateOverride.length ) {
			return '';
		}
		
		return [
			'<tree_override_prototypes>',
			templateOverride.join(''),
			'</tree_override_prototypes>',
		].join('');
	}
	
	getValues (): {[string]: number} {
		const { selection } = this.state;
		return { selection: selection };
	}
	
	selectOptions (): Array<Object> {
		const {selection} = this.state;
		const excludes: Array<string> = Object.keys(selection);
		
		return random.trees
			.filter(v => !excludes.includes(v))
			.map(v => ({
				label: v,
				value: v,
			}));
	}
	
	modifySelection ( name: string, attr: TreeAttr ): void {
		this.setState(({selection}) => ({
			selection: {
				...selection,
				[name]: {...selection[name], ...attr},
			}
		}));
	}
	
	removeFromSelection ( name: string ): void {
		const selection = {...this.state.selection};
		
		if ( selection.hasOwnProperty(name) ) {
			delete selection[name];
			this.setState({selection: {...selection}});
		}
	}
	
	selectionNodes (): Array<Node> {
		const {selection, override} = this.state;
		const nodes: Array<Node> = [];
		
		for ( let [name: string, attr: TreeAttr] of Object.entries(selection) ) {
			const enabled: boolean = attr._enabled && override;
			
			nodes.push(
				<Card key={name}>
					<Card.Header className="pt-0 pb-0 pl-2 pl-2">
						<div className="clearfix">
							<div className="float-left">
								<Accordion.Toggle disabled={!enabled} as={Button}
									variant="link" eventKey={`tree_${name}`}
									onClick={() => this.setState(({activeKey}) => ({activeKey: activeKey === name ? '': name}))}>
									{name}
								</Accordion.Toggle>
							</div>
							<div className="float-right">
								<Form.Check
									disabled={!override}
									className="d-inline-block position-relative"
									style={{top: '6px'}}
									type="switch"
									id={`enable-tree-${name}`}
									label=""
									checked={attr._enabled}
									onChange={e => this.modifySelection(name,{_enabled: Boolean(e.target.checked)})}
								/>
								{' '}
								<Button variant="link" disabled={!enabled}
									onClick={() => this.removeFromSelection(name)}
									style={{fontSize: '1.2rem', top: '1px'}}
									className="p-0 text-decoration-none position-relative text-dark" size="sm">
									&times;
								</Button>
							</div>
						</div>
					</Card.Header>
					<Accordion.Collapse eventKey={`tree_${name}`}>
						<Card.Body className="pt-2 pb-2">
							<Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled || !attr.density_enabled})}>
								<Form.Label className="text-size-sm" column={true} sm="2">
									<Form.Check
										disabled={!override}
										className="text-size-xs"
										type="switch"
										id={`tree_override_density-switch-${nanoid(5)}`}
										label={<span style={{textDecoration: 'underline dotted'}}
											title="The amount of objects of this type to place, has to be in the range.">
											Density:
										</span>}
										checked={attr.density_enabled}
										onChange={e => this.modifySelection(name, {density_enabled: Boolean(e.target.checked)})}
									/>
								</Form.Label>
								<Col sm="10">
									<span className="text-size-xs font-family-code">
										Value: <code>{attr.density}</code>
									</span>
									<Button disabled={!enabled || !attr.density_enabled}
										className="button-reset-sm" variant="link"
										onClick={() => this.modifySelection(name, {density: random.randomDensity()})}>
										Random
									</Button>
									<Button disabled={!enabled || !attr.density_enabled}
										className="button-reset-sm" variant="link"
										onClick={() => this.modifySelection(name, {density: Defaults.DENSITY_DEFAULT})}>
										Reset
									</Button>
									<UiSlider disabled={!enabled || !attr.density_enabled}
										step={0.01} min={Defaults.DENSITY_MIN} max={Defaults.DENSITY_MAX}
										value={Number(attr.density)} onChange={v => this.modifySelection(name, {density: v})}/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled || !attr.angle_enabled})}>
								<Form.Label className="text-size-sm" column={true} sm="2">
									<Form.Check
										disabled={!override}
										className="text-size-xs"
										type="switch"
										id={`tree_override_angle-switch-${nanoid(5)}`}
										label={<span style={{textDecoration: 'underline dotted'}}
											title="The min and max slope angles in degrees at which this object
											is placed. Values range from 0 (flat), to 60 (very steep). Negative
											values of up to -10 are allowed to ensure you get max density at 0
											degrees, as there is a transition zone.">
											Angle:
										</span>}
										checked={attr.angle_enabled}
										onChange={e => this.modifySelection(name, {angle_enabled: Boolean(e.target.checked)})}
									/>
								</Form.Label>
								<Col sm="10">
									<div>
										<span className="text-size-xs font-family-code">
										Min: <code>{attr.min_angle}</code>
											{' / '}
										Max: <code>{attr.max_angle}</code>
									</span>
										<Button disabled={!enabled || !attr.angle_enabled}
											className="button-reset-sm" variant="link"
											onClick={() => {
												const [min_angle, max_angle] = random.randomAngle();
												this.modifySelection(name, {min_angle, max_angle});
											}}>Random</Button>
										<Button disabled={!enabled || !attr.angle_enabled}
											className="button-reset-sm" variant="link"
											onClick={() => this.modifySelection(name, {
												min_angle: Defaults.ANGLE_MIN_DEFAULT,
												max_angle: Defaults.ANGLE_MAX_DEFAULT,
											})}>Default</Button>
									</div>
									<Range
										min={Defaults.ANGLE_MIN}
										max={Defaults.ANGLE_MAX}
										disabled={!enabled || !attr.angle_enabled}
										value={[attr.min_angle, attr.max_angle]}
										onChange={([min_angle, max_angle]) => {
											this.modifySelection(name, {min_angle, max_angle});
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
										Min: <code>{attr.min_altitude}</code>
											{' / '}
										Max: <code>{attr.max_altitude}</code>
									</span>
										<Button disabled={!enabled} className="button-reset-sm" variant="link"
											onClick={() => {
												const [min_altitude, max_altitude] = random.randomAltitude();
												this.modifySelection(name, {min_altitude, max_altitude});
											}}>Random</Button>
										<Button disabled={!enabled} className="button-reset-sm" variant="link"
											onClick={() => this.modifySelection(name, {
												min_altitude: Defaults.ALTITUDE_MIN_DEFAULT,
												max_altitude: Defaults.ALTITUDE_MAX_DEFAULT,
											})}>Default</Button>
									</div>
									<Range
										min={Defaults.ALTITUDE_MIN}
										max={Defaults.ALTITUDE_MAX}
										disabled={!enabled}
										value={[attr.min_altitude, attr.max_altitude]}
										onChange={([min_altitude, max_altitude]) => {
											this.modifySelection(name, {min_altitude, max_altitude});
										}}/>
								</Col>
							</Form.Group>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			);
		}
		
		return nodes;
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { override } = this.state;
		
		return (
			<Accordion>
				<Card className="mb-2">
					<Card.Header className="pt-1 pb-1 pl-2 pl-2">
						<Accordion.Toggle as={Button} variant="link" eventKey="tree_override_panel">
							Override Tree Prototypes
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="tree_override_panel">
						<Card.Body>
							<div className="mb-3">
								<Form.Check
									className="pull-right"
									type="switch"
									id={`tree_override-switch-${nanoid(5)}`}
									label="Override trees"
									checked={override}
									onChange={e => this.setState({override: Boolean(e.target.checked)})}
								/>
								<div className="mt-2 mt-2">
									<Select
										isDisabled={!override}
										menuPortalTarget={document.body}
										styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
										options={this.selectOptions()}
										placeholder="Choose tree to override"
										onChange={( selected: ?Object, {action}: Object ) => {
											if ( action === 'select-option' && selected ) {
												this.modifySelection(selected.value, getInitialValues());
												this.setState({activeKey: selected.value});
											}
										}}
									/>
								</div>
							</div>
							<Accordion activeKey={`tree_${this.state.activeKey}`}>
								{this.selectionNodes()}
							</Accordion>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		);
	};
}

// Properties validation
TreesOverride.propTypes = {
	onChange: () => {},
};

// Default properties
TreesOverride.defaultProps = {
	onChange: PropTypes.func,
};

export default TreesOverride;
 
