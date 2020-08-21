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
import randomFloat from 'random-float';

// Components
import UiSlider from './../../../../components/UiSlider';

const CONFIG_MIN_DENSITY: number = 0;
const CONFIG_MAX_DENSITY: number = 1;

/**
 * GlobalTreeDensity `props` type
 * @type {Object}
 */
type Props = {
	enable: boolean,
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * GlobalTreeDensity `state` type
 * @type {Object}
 */
type State = {
	value: number,
	enable: boolean,
};

/**
 * GlobalTreeDensity component class
 */
export class GlobalTreeDensity extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	constructor ( props: Props ) {
		super(props);
		this.state = {
			value: randomFloat(CONFIG_MIN_DENSITY, CONFIG_MAX_DENSITY).toFixed(2),
			enable: props.enable,
		};
	}
	
	/**
	 * @inheritDoc
	 */
	componentDidMount (): void {
		const {onChange} = this.props;
		setTimeout(() => {
			typeof onChange === 'function'
			&& onChange(this.toTemplateText(), this.getValue());
		}, 300);
	}
	
	/**
	 * @inheritDoc
	 */
	componentDidUpdate ( prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS ): void {
		const {enabled, onChange} = this.props;
		
		if ( JSON.stringify(this.state) !== JSON.stringify(prevState) ) {
			setTimeout(() => {
				typeof onChange === 'function'
				&& onChange(this.toTemplateText(), this.getValue());
			}, 300);
		}
		
		if ( enabled !== prevProps.enabled ) {
			this.setState({enabled});
		}
	}
	
	toTemplateText (): string {
		const { value, enable } = this.state;
		
		if ( !value ) {
			return '';
		}
		
		return enable ? `<global_tree_density value="${value}"/>` : '';
	}
	
	getValue (): {[string]: number} {
		const { value } = this.state;
		return { value };
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { value, enable } = this.state;
		
		return (
			<>
				<Card className="mb-2">
					<Card.Body>
						<Form.Group as={Row} className="mb-2">
							<Form.Label column={true} sm="3">
								<Form.Check
									type="switch"
									id={`global_tree_density-switch-${nanoid(5)}`}
									label="Global Tree Density"
									onChange={e => {
										this.setState({enable: Boolean(e.target.checked)})
									}}
								/>
							</Form.Label>
							<Col sm="9">
									<span className="text-size-xs font-family-code">
										Value: <code>{value}</code>
									</span>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({
										value: randomFloat(CONFIG_MIN_DENSITY, CONFIG_MAX_DENSITY).toFixed(2),
									})}>
									Random
								</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({value: 1})}>Reset</Button>
								<UiSlider step={0.01} disabled={!enable} min={CONFIG_MIN_DENSITY} max={CONFIG_MAX_DENSITY}
									value={Number(value)} onChange={v => this.setState({value: v})}/>
							</Col>
						</Form.Group>
					</Card.Body>
				</Card>
			</>
		);
	};
}

// Properties validation
GlobalTreeDensity.defaultProps = {
	enable: false,
	onChange: () => {},
};

// Default properties
GlobalTreeDensity.propTypes = {
	enable: PropTypes.bool,
	onChange: PropTypes.func,
};

export default GlobalTreeDensity;