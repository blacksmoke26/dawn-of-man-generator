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
 * Trees `props` type
 * @type {Object}
 */
type Props = {
	enable: boolean,
	onChange ( template: string, values?: {[string]: any} ): void,
};

/**
 * Trees `state` type
 * @type {Object}
 */
type State = {
	trees: Array<string>,
	enable: boolean,
};

/**
 * Trees component class
 */
export class Trees extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	constructor ( props: Props ) {
		super(props);
		this.state = {
			trees: random.randomTrees(),
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
			&& onChange(this.toTemplateText(), this.getValues());
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
				&& onChange(this.toTemplateText(), this.getValues());
			}, 300);
		}
		
		if ( enabled !== prevProps.enabled ) {
			this.setState({enabled});
		}
	}
	
	toTemplateText (): string {
		const { trees, enable } = this.state;
		const val: string = trees.join(' ').trim();
		
		if ( !val ) {
			return '';
		}
		
		return enable ? `<trees values="${trees.join(' ')}"/>` : '';
	}
	
	getValues (): {[string]: number} {
		const { trees } = this.state;
		return { trees };
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { trees, enable } = this.state;
		const allTrees: string = trees.join(' ').trim();
		
		return (
			<>
				<Card className={cn('mb-2', {'text-muted': !enable})}>
					<Card.Body>
						<Row className="mb-1">
							<Col xs="10">
								Present Trees <code className="pl-2 text-size-xs">{!allTrees ? '<None>' : allTrees}</code>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({trees: random.randomTrees()})}>
									Random
								</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({trees: [...random.trees]})}>All</Button>
								<Button disabled={!enable} className="button-reset-sm" variant="link"
									onClick={() => this.setState({trees: []})}>None</Button>
								<div className="text-size-xxs text-muted mt-1">
									What trees are present in the level.
								</div>
							</Col>
							<Col xs="2" className="text-right">
								<Form.Check
									className="pull-right"
									type="switch"
									id={`trees-present-switch-${nanoid(5)}`}
									label=""
									checked={enable}
									onChange={e => this.setState({enable: Boolean(e.target.checked)})}
								/>
							</Col>
						</Row>
						<ul className="list-unstyled list-inline mb-0">
							{random.trees.map(v => (
								<li key={v} className="list-inline-item mb-1">
									<Form.Check
										disabled={!enable}
										custom
										data-value={v}
										checked={trees.findIndex(val => v === val) !== -1}
										id={`trees_${v}`}
										label={v}
										onChange={(e: Event) => {
											const list = trees.filter(val => val !== e.target.getAttribute('data-value'));
											e.target.checked && list.push(v);
											this.setState({trees: [...list]});
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
Trees.defaultProps = {
	enable: false,
	onChange: () => {},
};

// Default properties
Trees.propTypes = {
	enable: PropTypes.bool,
	onChange: PropTypes.func,
};

export default Trees;
