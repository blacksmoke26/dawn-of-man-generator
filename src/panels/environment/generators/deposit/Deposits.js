// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import cn from 'classname';

// Utils
import * as random from '../../../../utils/random';

/**
 * Deposits `props` type
 * @type {Object}
 */
type Props = {
	enabled?: boolean,
	deposits?: Array<string>,
	onChange ( template: string, value?: Array<string> ): void,
};

/** Deposits functional component */
function Deposits ( props: Props ) {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [deposits, setDeposits] = React.useState<string[]>(props.deposits);
	
	const {extValue} = useSelector(( {environment} ) => ({
		extValue: environment?.deposits ?? null,
	}));
	
	// Reflect attributes changes
	React.useEffect(() => {
		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
		}
		
		if ( Array.isArray(extValue) ) {
			setEnabled(true);
			setDeposits(extValue);
		}
	}, [extValue]);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled);
		setDeposits([...props.deposits]);
	}, [props.enabled, props.deposits]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), deposits);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deposits, enabled]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return enabled && deposits.length
			? `<deposits values="${deposits.join(' ')}"/>`
			: '';
	}, [deposits, enabled]);
	
	return (
		<Card className={cn('mb-2', {'text-muted': !enabled})}>
			<Card.Body>
				<Row className="mb-1">
					<Col xs="10">
						Deposits <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
							{!deposits.length ? '<None>' : deposits.join(', ')}
						</code>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setDeposits(random.randomDeposits())}>
							Random
						</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setDeposits([...random.deposits])}>All</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setDeposits([])}>None</Button>
						<div className="text-size-xxs text-muted mt-1">
							What types of deposit are present in the level.
						</div>
					</Col>
					<Col xs="2" className="text-right">
						<Form.Check
							className="pull-right"
							type="switch"
							id={`deposit-switch-${nanoid(5)}`}
							label=""
							checked={enabled}
							onChange={e => setEnabled(e.target.checked)}
						/>
					</Col>
				</Row>
				<ul className="list-unstyled list-inline mb-0 fixed-width">
					{random.deposits.map(v => (
						<li key={v} className="list-inline-item">
							<Form.Check
								disabled={!enabled}
								custom
								data-value={v}
								checked={deposits.findIndex(val => v === val) !== -1}
								id={`deposit_${v}`}
								label={v}
								onChange={( e: Event ) => {
									const list = deposits.filter(val => val !== e.target.getAttribute('data-value'));
									console.log({list});
									e.target.checked && list.push(v);
									setDeposits([...list]);
								}}
							/>
						</li>
					))}
				</ul>
			</Card.Body>
		</Card>
	);
}

// Default properties
Deposits.propTypes = {
	enabled: PropTypes.bool,
	deposits: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func,
};

// Properties validation
Deposits.defaultProps = {
	enabled: false,
	deposits: random.randomDeposits(),
	onChange: () => {},
};

export default Deposits;
