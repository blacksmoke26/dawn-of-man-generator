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
 * BackdropScale `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * BackdropScale `state` type
 * @type {Object}
 */
type State = {
	angle1: number,
	angle2: number,
	angle3: number,
	enable: boolean,
};

const defaultValues: Object = {
	angle1: 1.0,
	angle2: 0.25,
	angle3: 1.0,
}

/**
 * BackdropScale component class
 */
export class BackdropScale extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		...defaultValues,
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
		const { angle1, angle2, angle3, enable } = this.state;
		return enable ? `<backdrop_scale value="${angle1}, ${angle2}, ${angle3}"/>` : '';
	}
	
	getValues (): {[string]: number} {
		const { angle1, angle2, angle3 } = this.state;
		return { angle1, angle2, angle3 };
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { angle1, angle2, angle3, enable } = this.state;
		
		return (
			<>
				<Card className="mb-2">
					<Card.Body>
						<Row className="mb-1">
							<Col xs="10" className={cn({'text-muted': !enable})}>
								Backdrop Scale <code className="pl-2 text-size-xs">{angle1}, {angle2}, {angle3}</code>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => {
										const rand = random.randomBackdropScale();
										this.setState({angle1: rand[0], angle2: rand[1], angle3: rand[2]});
									}}>
									Random
								</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({...defaultValues})}>Reset</Button>
								<div className="text-size-xxs text-muted mt-1">
									Change the size of backdrops (the mountains you see beyond the map).
								</div>
							</Col>
							<Col xs="2" className="text-right">
								<Form.Check
									className="pull-right"
									type="switch"
									id={`backdrop_scale-switch-${nanoid(5)}`}
									label=""
									checked={enable}
									onChange={e => this.setState({enable: Boolean(e.target.checked)})}
								/>
							</Col>
						</Row>
						<div className="mb-2">
							<UiSlider disabled={!enable} step={0.01} value={Number(angle1)} onChange={v => this.setState({angle1: v})}/>
						</div>
						<div className="mb-2">
							<UiSlider disabled={!enable} step={0.01} value={Number(angle2)} onChange={v => this.setState({angle2: v})}/>
						</div>
						<div className="mb-2">
							<UiSlider disabled={!enable} step={0.01} value={Number(angle3)} onChange={v => this.setState({angle3: v})}/>
						</div>
					</Card.Body>
				</Card>
			</>
		);
	};
}

// Properties validation
BackdropScale.defaultProps = {
	onChange: () => {},
};

// Default properties
BackdropScale.propTypes = {
	onChange: PropTypes.func,
};

export default BackdropScale;
