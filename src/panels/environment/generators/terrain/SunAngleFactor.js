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

// Components
import UiSlider from './../../../../components/UiSlider';

// Utils
import * as random from '../../../../utils/random';

/**
 * SunAngleFactor `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * SunAngleFactor `state` type
 * @type {Object}
 */
type State = {
	angle: number,
	enable: boolean,
};

const fraction: number = 2;

/**
 * SunAngleFactor component class
 */
export class SunAngleFactor extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		angle: random.randomFrequency(fraction),
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
		const { angle, enable } = this.state;
		return enable ? `<sun_angle_factor value="${angle}"/>` : '';
	}
	
	getValues (): {[string]: number} {
		const { angle } = this.state;
		return { angle: angle };
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { angle, enable } = this.state;
		
		return (
			<>
				<Card className={cn('mb-2', {'text-muted': !enable})}>
					<Card.Body>
						<Row className="mb-1">
							<Col xs="10">
								Sun Angle Factor <code className="pl-2 text-size-xs">{angle}</code>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({angle: random.randomFrequency(fraction)})}>
									Random
								</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({angle: 0})}>Reset</Button>
								<div className="text-size-xxs text-muted mt-1">
									How high is the sun in the sky, 1.0 is the default.
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
						<UiSlider disabled={!enable} value={Number(angle)} onChange={v => this.setState({angle: v})}/>
					</Card.Body>
				</Card>
			</>
		);
	};
}

// Properties validation
SunAngleFactor.defaultProps = {
	onChange: () => {},
};

// Default properties
SunAngleFactor.propTypes = {
	onChange: PropTypes.func,
};

export default SunAngleFactor;
