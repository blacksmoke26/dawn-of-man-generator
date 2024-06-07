// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import { nanoid } from 'nanoid';
import { Card, Form, Row, Col } from 'react-bootstrap';

// redux
import {useAppSelector} from '~redux/hooks';

/** Category `props` type */
interface Props {
	enabled?: boolean,
	value?: string,

	onChange?(template: string, value: string): void,
}

/** Category functional component */
const Category = ( props: Props ) => {
	props = merge({
		value: 'Freeplay',
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<string>(props.value as string);
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const scenario = useAppSelector(({scenario}) => (scenario));
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = scenario?.requiredScenario ?? null;
		
		if ( !extValue ) {
			setEnabled(!!extValue);
		} else {
			setValue(extValue as string);
		}
	}, [scenario]);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled as boolean);
	}, [props.enabled]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);
	
	const toTemplateText = (): string => {
		return !enabled
			? ''
			: `<category value="${value}"/>`;
	};
	
	return (
		<Card className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
			<Card.Body>
				<Row className="mb-1">
					<Col xs="10">
						Category
						<div className="text-size-xxs text-muted mt-1">
							Defines the category for the scenario.
						</div>
					</Col>
					<Col xs="2" className="text-right">
						<Form.Check
							className="pull-right"
							type="switch"
							id={`category-switch-${nanoid(5)}`}
							label=""
							checked={enabled}
							onChange={e => setEnabled(e.target.checked)}
						/>
					</Col>
				</Row>
				<Form.Control
					type="text"
					disabled={!enabled}
					className="pull-right"
					aria-disabled={!enabled}
					id={`category-${nanoid(5)}`}
					aria-placeholder={props.value}
					value={value}
					onChange={e => setValue(e.target.value)}
				/>
			</Card.Body>
		</Card>
	);
};

// Properties validation
Category.propTypes = {
	value: PropTypes.bool,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default Category;
