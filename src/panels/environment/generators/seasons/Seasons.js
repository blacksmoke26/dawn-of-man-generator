// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Card, Button, Form, Accordion } from 'react-bootstrap';
import { nanoid } from 'nanoid';

// Components
import Spring from './Spring';
import Summer from './Summer';
import Fall from './Fall';
import Winter from './Winter';

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
	spring: string,
	summer: string,
	fall: string,
	winter: string,
	override: boolean,
};

/**
 * TreesEverywhere component class
 */
export class Seasons extends React.Component<Props, State> {
	/**
	 * @inheritDoc
	 */
	state: State = {
		spring: '',
		summer: '',
		fall: '',
		winter: '',
		override: false,
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
		const { spring, summer, fall, winter, override } = this.state;
		
		if ( !override ) {
			return '';
		}
		
		return [
			'<seasons>',
				spring, summer,
				fall, winter,
			'</seasons>',
		].join('');
	}
	
	getValues (): {[string]: number} {
		const { spring, summer, fall, winter } = this.state;
		return { spring, summer, fall, winter };
	}
	
	/**
	 * @inheritDoc
	 */
	render () {
		const { override } = this.state;
		
		return (
			<>
				<div className="mb-3">
					<Form.Check
						className="pull-right"
						type="switch"
						id={`seasons_override-switch-${nanoid(5)}`}
						label="Override seasons"
						checked={override}
						onChange={e => this.setState({override: Boolean(e.target.checked)})}
					/>
				</div>
				<Accordion defaultActiveKey="seasons_spring">
					<Card>
						<Card.Header className="pt-1 pb-1 pl-2 pl-2">
							<Accordion.Toggle as={Button} variant="link" eventKey="seasons_spring">
								Spring
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey="seasons_spring">
							<Card.Body>
								<Spring onChange={( v: string ) => this.setState({spring: v})} enabled={override}/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card>
						<Card.Header className="pt-1 pb-1 pl-2 pl-2">
							<Accordion.Toggle as={Button} variant="link" eventKey="seasons_summer">
								Summer
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey="seasons_summer">
							<Card.Body>
								<Summer onChange={( v: string ) => this.setState({summer: v})} enabled={override}/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card>
						<Card.Header className="pt-1 pb-1 pl-2 pl-2">
							<Accordion.Toggle as={Button} variant="link" eventKey="seasons_fall">
								Fall
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey="seasons_fall">
							<Card.Body>
								<Fall onChange={( v: string ) => this.setState({fall: v})} enabled={override}/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card>
						<Card.Header className="pt-1 pb-1 pl-2 pl-2">
							<Accordion.Toggle as={Button} variant="link" eventKey="seasons_winter">
								Winter
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey="seasons_winter">
							<Card.Body>
								<Winter onChange={( v: string ) => this.setState({winter: v})} enabled={override}/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
				</Accordion>
			</>
		);
	};
}

// Properties validation
Seasons.propTypes = {
	onChange: PropTypes.func,
};

// Default properties
Seasons.defaultProps = {
	onChange: () => {},
};

export default Seasons;
