// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { nanoid } from 'nanoid';

// Utils
import * as random from '../../../../utils/random';

/**
 * Deposits `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * Deposits `state` type
 * @type {Object}
 */
type State = {
	deposits: Array<string>,
	enable: boolean,
};

/**
 * Deposits component class
 */
export class Deposits extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		deposits: random.randomDeposits(),
		enable: true,
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
		const { deposits, enable } = this.state;
		const val: string = deposits.join(' ').trim();
		
		if ( !val ) {
			return '';
		}
		
		return enable ? `<deposits values="${deposits.join(' ')}"/>` : '';
	}
	
	getValues (): {[string]: number} {
		const { deposits } = this.state;
		return { deposits: deposits };
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { deposits, enable } = this.state;
		const depositVal: string = deposits.join(' ').trim();
		
		return (
			<>
				<Card className="mb-2">
					<Card.Body>
						<Row className="mb-1">
							<Col xs="10">
								Deposits <code className="pl-2 text-size-xs">{!depositVal ? '<None>' : depositVal}</code>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({deposits: random.randomDeposits()})}>
									Random
								</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({deposits: [...random.deposits]})}>All</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({deposits: []})}>None</Button>
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
									checked={enable}
									onChange={e => this.setState({enable: Boolean(e.target.checked)})}
								/>
							</Col>
						</Row>
						<ul className="list-unstyled list-inline mb-0">
							{random.deposits.map(v => (
								<li key={v} className="list-inline-item">
									<Form.Check
										disabled={!enable}
										custom
										data-value={v}
										checked={deposits.findIndex(val => v === val) !== -1}
										id={`deposit_${v}`}
										label={v}
										onChange={(e: Event) => {
											const list = deposits.filter(val => val !== e.target.getAttribute('data-value'));
											e.target.checked && list.push(v);
											this.setState({deposits: [...list]});
										}}
									/>
								</li>
							))}
						</ul>
					</Card.Body>
				</Card>
			</>
		);
	};
}

// Properties validation
Deposits.defaultProps = {
	onChange: () => {},
};

// Default properties
Deposits.propTypes = {
	onChange: PropTypes.func,
};

export default Deposits;
