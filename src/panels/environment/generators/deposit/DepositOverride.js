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
import cn from 'classname';
import { Range } from 'rc-slider';

// Utils
import * as random from './../../../../utils/random';
import * as Defaults from './../../../../utils/defaults';

type DepositAttr = {
	min_angle?: number,
	max_angle?: number,
	_enabled: boolean,
};

type DepositSelection = {
	[string]: DepositAttr
};

const depositAttrDefaults: DepositAttr = {
	min_angle: Defaults.ANGLE_MIN_DEFAULT,
	max_angle: Defaults.ANGLE_MAX_DEFAULT,
	_enabled: true,
};

/**
 * DepositOverride `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * DepositOverride `state` type
 * @type {Object}
 */
type State = {
	override: boolean,
	selection: DepositSelection,
	activeKey: string,
};

/**
 * DepositOverride component class
 */
export class DepositOverride extends React.Component<Props, State> {
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
		
		for ( let [name: string, attr: DepositAttr] of Object.entries(selection) ) {
			if ( !attr._enabled ) {
				continue;
			}
			
			templateOverride.push(
				'<deposit_override_prototype>'
				+ `<id value="${name}"/>`
				+ `<min_angle value="${attr.min_angle}" /><max_angle value="${attr.max_angle}"/>`
				+ '</deposit_override_prototype>'
			);
		}
		
		if ( !templateOverride.length ) {
			return '';
		}
		
		return [
			'<deposit_override_prototypes>',
			templateOverride.join(''),
			'</deposit_override_prototypes>',
		].join('');
	}
	
	getValues (): {[string]: number} {
		const { selection } = this.state;
		return { selection: selection };
	}
	
	selectOptions (): Array<Object> {
		const {selection} = this.state;
		const excludes: Array<string> = Object.keys(selection);
		
		return random.deposits
			.filter(v => !excludes.includes(v))
			.map(v => ({
				label: v,
				value: v,
			}));
	}
	
	modifySelection ( name: string, attr: DepositAttr ): void {
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
		
		for ( let [name: string, attr: DepositAttr] of Object.entries(selection) ) {
			const enabled: boolean = attr._enabled && override;
			
			nodes.push(
				<Card key={name}>
					<Card.Header className="pt-0 pb-0 pl-2 pl-2">
						<div className="clearfix">
							<div className="float-left">
								<Accordion.Toggle disabled={!enabled} as={Button}
									variant="link" eventKey={`deposit_${name}`}
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
									id={`enable-deposit-${name}`}
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
					<Accordion.Collapse eventKey={`deposit_${name}`}>
						<Card.Body className="pt-2 pb-2">
							<Form.Group as={Row} className={cn('mb-2', {'text-muted': !enabled})}>
								<Form.Label className="text-size-sm" column={true} sm="2">
									<span style={{textDecoration: 'underline dotted'}}
										title="The min and max slope angles in degrees at which this object
											is placed. Values range from 0 (flat), to 60 (very steep). Negative
											values of up to -10 are allowed to ensure you get max density at 0
											degrees, as there is a transition zone.">
										Angle:
									</span>
								</Form.Label>
								<Col sm="10">
									<div>
										<span className="text-size-xs font-family-code">
										Min: <code>{attr.min_angle}</code>
											{' / '}
										Max: <code>{attr.max_angle}</code>
									</span>
										<Button disabled={!enabled} className="button-reset-sm" variant="link"
											onClick={() => {
												const [min_angle, max_angle] = random.randomAngle();
												this.modifySelection(name, {min_angle, max_angle});
											}}>Random</Button>
										<Button disabled={!enabled} className="button-reset-sm" variant="link"
											onClick={() => this.modifySelection(name, {
												min_angle: Defaults.ANGLE_MIN_DEFAULT,
												max_angle: Defaults.ANGLE_MAX_DEFAULT,
											})}>Default</Button>
									</div>
									<Range
										min={Defaults.ANGLE_MIN}
										max={Defaults.ANGLE_MAX}
										disabled={!enabled}
										value={[attr.min_angle, attr.max_angle]}
										onChange={([min_angle, max_angle]) => {
											this.modifySelection(name, {min_angle, max_angle});
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
						<Accordion.Toggle as={Button} variant="link" eventKey="deposit_override_panel">
							Override Deposit Prototypes
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="deposit_override_panel">
						<Card.Body>
							<div className="mb-3">
								<Form.Check
									className="pull-right"
									type="switch"
									id={`deposit_override-switch-${nanoid(5)}`}
									label="Override deposit"
									checked={override}
									onChange={e => this.setState({override: Boolean(e.target.checked)})}
								/>
								<div className="mt-2 mt-2">
									<Select
										isDisabled={!override}
										menuPortalTarget={document.body}
										styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
										options={this.selectOptions()}
										placeholder="Choose deposit to override"
										onChange={( selected: ?Object, {action}: Object ) => {
											if ( action === 'select-option' && selected ) {
												this.modifySelection(selected.value, depositAttrDefaults);
												this.setState({activeKey: selected.value});
											}
										}}
									/>
								</div>
							</div>
							<Accordion activeKey={`deposit_${this.state.activeKey}`}>
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
DepositOverride.propTypes = {
	onChange: () => {},
};

// Default properties
DepositOverride.defaultProps = {
	onChange: PropTypes.func,
};

export default DepositOverride;
 
