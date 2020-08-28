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

// Types
import { Node } from 'react';

// Utils
import * as random from './../../../../utils/random';
import * as Defaults from './../../../../utils/defaults';

// Styles
import * as reactSelect from './../../../../blocks/react-select';

type DepositAttr = {
	_enabled: boolean,
	min_angle?: number,
	max_angle?: number,
};

type DepositSelection = {
	[string]: DepositAttr
};

const getInitialValues = (): DepositAttr => {
	let [min_angle, max_angle] = random.randomAngle();
	
	return {
		_enabled: true,
		min_angle, max_angle,
	}
};

/**
 * DepositOverride `props` type
 * @type {Object}
 */
type Props = {
	enabled?: boolean,
	selection?: DepositSelection,
	onChange ( template: string, values?: {[string]: any} ): void,
};

/** DepositOverride functional component */
function DepositOverride ( props: Props ) {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [selection, setSelection] = React.useState<DepositSelection>(props.selection);
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
		
		for ( let [name: string, attr: TreeAttr] of Object.entries(selection) ) {
			if ( !attr._enabled ) {
				continue;
			}
			
			templateOverride.push(
				`<deposit_override_prototype>
					<id value="${name}"/>
					<min_angle value="${attr.min_angle}"/>
					<min_angle value="${attr.max_angle}"/>
				</deposit_override_prototype>`
			);
		}
		
		return templateOverride.length
			? (
				`<deposit_override_prototypes>
				${templateOverride.join('')}
				</deposit_override_prototypes>`
			) : '';
	}, [enabled, selection]);
	
	/** Get react-select options */
	const renderSelectOptions = React.useCallback((): Array<Object> => {
		const excludes: Array<string> = Object.keys(selection);
		
		return random.deposits
			.filter(v => !excludes.includes(v))
			.map(v => ({label: v, value: v}));
	}, [selection]);
	
	/** Update given selection data */
	const modifySelection = ( name: string, attr: DepositAttr ): void => {
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
		
		for ( let [name: string, attr: DepositAttr] of Object.entries(selection) ) {
			const isEnabled: boolean = attr._enabled && enabled;
			
			nodes.push(
				<Card key={name}>
					<Card.Header className="pt-0 pb-0 pl-2 pl-2">
						<div className="clearfix">
							<div className="float-left">
								<Accordion.Toggle disabled={!isEnabled} as={Button}
									variant="link" eventKey={`deposit_${name}`}
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
									id={`enable-deposit-${name}`}
									label=""
									checked={attr._enabled}
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
					<Accordion.Collapse eventKey={`deposit_${name}`}>
						<Card.Body className="pt-2 pb-2">
							<Form.Group as={Row} className={cn('mb-2', {'text-muted': !isEnabled})}>
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
											Min: <code className={cn({'text-muted': !isEnabled})}>{attr.min_angle}</code>
											{' / '}
											Max: <code className={cn({'text-muted': !isEnabled})}>{attr.max_angle}</code>
										</span>
										<Button disabled={!isEnabled} className="button-reset-sm" variant="link"
											onClick={() => {
												const [min_angle, max_angle] = random.randomAngle();
												modifySelection(name, {min_angle, max_angle});
											}}>Random</Button>
										<Button disabled={!isEnabled} className="button-reset-sm" variant="link"
											onClick={() => modifySelection(name, {
												min_angle: Defaults.ANGLE_MIN_DEFAULT,
												max_angle: Defaults.ANGLE_MAX_DEFAULT,
											})}>Default</Button>
									</div>
									<Range
										min={Defaults.ANGLE_MIN}
										max={Defaults.ANGLE_MAX}
										disabled={!isEnabled}
										value={[attr.min_angle, attr.max_angle]}
										onChange={([min_angle, max_angle]) => {
											modifySelection(name, {min_angle, max_angle});
										}}/>
								</Col>
							</Form.Group>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			);
		}
		
		return nodes;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enabled, selection]);
	
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
								checked={enabled}
								onChange={e => setEnabled(e.target.checked)}
							/>
							<div className="mt-2 mt-2">
								<Select
									theme={reactSelect.theme}
									styles={reactSelect.styles}
									isDisabled={!enabled}
									menuPortalTarget={document.body}
									options={renderSelectOptions()}
									placeholder="Choose deposit to override"
									onChange={( selected: ?Object, {action}: Object ) => {
										if ( action === 'select-option' && selected ) {
											modifySelection(selected.value, getInitialValues());
											setActiveKey(selected.value);
										}
									}}
								/>
							</div>
						</div>
						<Accordion activeKey={`deposit_${activeKey}`}>
							{selectionNodes()}
						</Accordion>
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
}

// Properties validation
DepositOverride.propTypes = {
	enabled: PropTypes.bool,
	selection: PropTypes.object,
	onChange: PropTypes.func,
};

// Default properties
DepositOverride.defaultProps = {
	enabled: true,
	selection: {},
	onChange: () => {},
};

export default DepositOverride;
 
