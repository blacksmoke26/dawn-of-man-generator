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
import nanoid from 'nanoid';
import randomInt from 'random-int';
import { Range } from 'rc-slider';

// Utils
import * as random from '../../../../utils/random';

const CONFIG_MIN_ALTITUDE = -20;
const CONFIG_MAX_ALTITUDE = 100;

type TreeAttr = {
	min_altitude: number,
	max_altitude: number,
	_enabled: boolean,
};

type TreeSelection = {
	[string]: TreeAttr
};

const treeAttrDefaults: Object = {
	min_altitude: 5,
	max_altitude: 10,
	_enabled: true,
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
			
			templateOverride.push(
				'<tree_override_prototype>'
				+ `<id value="${name}"/>`
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
							<Form.Group as={Row} className="mb-2">
								<Form.Label className="text-size-sm" column={true} sm="2">
									Altitude
								</Form.Label>
								<Col sm="10">
									<span className="text-size-xs font-family-code">
										Min: <code>{attr.min_altitude}</code>
											{' / '}
										Max: <code>{attr.max_altitude}</code>
									</span>
									<Button disabled={!enabled} className="button-reset-sm" variant="link"
										onClick={() => this.modifySelection(name, {
											min_altitude: randomInt(CONFIG_MIN_ALTITUDE, 10),
											max_altitude: randomInt(11, CONFIG_MAX_ALTITUDE),
										})}>Random</Button>
									<Button disabled={!enabled} className="button-reset-sm" variant="link"
										onClick={() => this.modifySelection(name, {
											min_altitude: treeAttrDefaults.min_altitude,
											max_altitude: treeAttrDefaults.max_altitude,
										})}>Default</Button>
									<Range
										min={CONFIG_MIN_ALTITUDE}
										max={CONFIG_MAX_ALTITUDE}
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
												this.modifySelection(selected.value, treeAttrDefaults);
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
 
