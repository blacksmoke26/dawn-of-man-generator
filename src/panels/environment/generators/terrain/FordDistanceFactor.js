// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import {nanoid} from 'nanoid';

// Components
import UiSlider from './../../../../components/UiSlider';

// Utils
import * as random from '../../../../utils/random';

/**
 * FordDistanceFactor `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * FordDistanceFactor `state` type
 * @type {Object}
 */
type State = {
	distance: number,
	enable: boolean,
};

const fraction: number = 2;

/**
 * FordDistanceFactor component class
 */
export class FordDistanceFactor extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		distance: random.randomFrequency(fraction),
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
		const { distance, enable } = this.state;
		return enable ? `<ford_distance_factor value="${distance}"/>` : '';
	}
	
	getValues (): {[string]: number} {
		const { distance } = this.state;
		return { distance };
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { distance, enable } = this.state;
		
		return (
			<>
				<Card className="mb-2">
					<Card.Body>
						<Row className="mb-1">
							<Col xs="10">
								Ford Distance Factor <code className="pl-2 text-size-xs">{distance}</code>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({distance: random.randomFrequency(fraction)})}>
									Random
								</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({distance: 0})}>Reset</Button>
								<div className="text-size-xxs text-muted mt-1">
									The average distance between river fords, 1.0 is the default.
								</div>
							</Col>
							<Col xs="2" className="text-right">
								<Form.Check
									className="pull-right"
									type="switch"
									id={`river-switch-${nanoid(5)}`}
									label=""
									checked={enable}
									onChange={e => this.setState({enable: Boolean(e.target.checked)})}
								/>
							</Col>
						</Row>
						<UiSlider disabled={!enable} value={Number(distance)} onChange={v => this.setState({distance: v})}/>
					</Card.Body>
				</Card>
			</>
		);
	};
}

// Properties validation
FordDistanceFactor.defaultProps = {
	onChange: () => {},
};

// Default properties
FordDistanceFactor.propTypes = {
	onChange: PropTypes.func,
};

export default FordDistanceFactor;
