// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import nanoid from 'nanoid';
import randomFloat from 'random-float';

// Components
import UiSlider from './../../../components/UiSlider';

const randomize: () => number = (): number => Number(randomFloat(0, 30)).toFixed(2);

/**
 * ResourceFactor `props` type
 * @type {Object}
 */
type Props = {
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * ResourceFactor `state` type
 * @type {Object}
 */
type State = {
	resource: number,
	enable: boolean,
};

/**
 * ResourceFactor component class
 */
export class ResourceFactor extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		resource: randomize(),
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
		const { resource, enable } = this.state;
		return enable ? `<resource_factor value="${resource}"/>` : '';
	}
	
	getValues (): {[string]: number} {
		const { resource } = this.state;
		return { resource: resource };
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { resource, enable } = this.state;
		
		return (
			<>
				<Card className="mb-2">
					<Card.Body>
						<Row className="mb-1">
							<Col xs="10">
								Resource Factor <code className="pl-2 text-size-xs">{resource}</code>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({resource: randomize()})}>
									Random
								</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({resource: 0})}>Reset</Button>
								
								<div className="text-size-xxs text-muted mt-1">
									The amount of resources in the map. 1.0 is the default.
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
						<UiSlider step={0.01}
							min={0}
							max={30}
							disabled={!enable} value={Number(resource)}
							onChange={v => this.setState({resource: v})}/>
					</Card.Body>
				</Card>
			</>
		);
	};
}

// Properties validation
ResourceFactor.defaultProps = {
	onChange: () => {},
};

// Default properties
ResourceFactor.propTypes = {
	onChange: PropTypes.func,
};

export default ResourceFactor;
