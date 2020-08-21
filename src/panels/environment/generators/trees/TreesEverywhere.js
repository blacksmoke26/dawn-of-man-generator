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
import cn from 'classname';

// Utils
import * as random from '../../../../utils/random';

/**
 * TreesEverywhere `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * TreesEverywhere `state` type
 * @type {Object}
 */
type State = {
	trees: boolean,
	enable: boolean,
};

/**
 * TreesEverywhere component class
 */
export class TreesEverywhere extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		trees: random.randomRiver(),
		enable: false,
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
		const { trees, enable } = this.state;
		return enable ? `<trees_everywhere value="${trees ? 'true' : 'false'}"/>` : '';
	}
	
	getValues (): {[string]: number} {
		const { trees } = this.state;
		return { trees: trees };
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { trees, enable } = this.state;
		
		return (
			<>
				<Card className={cn('mb-2', {'text-muted': !enable})}>
					<Card.Body>
						<Row className="mb-1">
							<Col xs="10">
								Trees Everywhere <code className="pl-2 text-size-xs">{trees ? '<True>' : '<False>'}</code>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({trees: random.randomRiver()})}>
									Random
								</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({trees: false})}>None</Button>
							</Col>
							<Col xs="2" className="text-right">
								<Form.Check
									className="pull-right"
									type="switch"
									id={`trees_everywhere-switch-${nanoid(5)}`}
									label=""
									checked={enable}
									onChange={e => this.setState({enable: Boolean(e.target.checked)})}
								/>
							</Col>
						</Row>
						<Form.Check
							custom
							className="pull-right"
							disabled={!enable}
							id={`trees_everywhere-${nanoid(5)}`}
							label="Show everywhere?"
							checked={trees}
							onChange={e => this.setState({trees: Boolean(e.target.checked)})}
						/>
					</Card.Body>
				</Card>
			</>
		);
	};
}

// Properties validation
TreesEverywhere.defaultProps = {
	onChange: () => {},
};

// Default properties
TreesEverywhere.propTypes = {
	onChange: PropTypes.func,
};

export default TreesEverywhere;
