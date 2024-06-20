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
import {nanoid} from 'nanoid';
import {Col, Form, Row} from 'react-bootstrap';

// redux
import {useAppSelector} from '~redux/hooks';

/** RequiredScenario `props` type */
interface Props {
	enabled?: boolean,
	value?: string,

	onChange?(template: string, value: string): void,
}

/** RequiredScenario functional component */
const RequiredScenario = ( props: Props ) => {
	props = merge({
		value: 'the_long_march',
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<string>(props.value as string);
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const requiredScenarioAttribute = useAppSelector(({scenario}) => scenario?.values?.requiredScenario);
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = requiredScenarioAttribute ?? null;
		
		if ( !extValue ) {
			setEnabled(!!extValue);
		} else {
			setValue(extValue as string);
		}
	}, [requiredScenarioAttribute]);
	
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
			: `<required_scenario value="${value}"/>`;
	};
	
	return (
		<div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
			<Row className="mb-1">
				<Col xs="10">
					Required Scenario
					<div className="text-size-xxs text-muted mt-1">
						Specifies another scenario the user has to complete before playing this one.
					</div>
				</Col>
				<Col xs="2" className="text-right">
					<Form.Check
						className="pull-right"
						type="switch"
						id={`required_scenario-switch-${nanoid(5)}`}
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
				id={`required_scenario-${nanoid(5)}`}
				aria-placeholder={props.value}
				value={value}
				onChange={e => setValue(e.target.value.trim())}
			/>
		</div>
	);
};

// Properties validation
RequiredScenario.propTypes = {
	value: PropTypes.bool,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default RequiredScenario;
