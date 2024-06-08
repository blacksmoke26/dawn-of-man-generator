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

/** LoadingScreen `props` type */
interface Props {
	enabled?: boolean,
	value?: string,

	onChange?(template: string, value: string): void,
}

/** LoadingScreen functional component */
const LoadingScreen = ( props: Props ) => {
	props = merge({
		value: 'map_the_northlands',
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<string>(props.value as string);
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const scenario = useAppSelector(({scenario}) => (scenario));
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = scenario?.loadingScreen ?? null;
		
		if ( !extValue ) {
			setEnabled(false);
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
			: `<loading_screens values="${value}"/>`;
	};
	
	return (
		<Card className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
			<Card.Body>
				<Row className="mb-1">
					<Col xs="10">
						Required Scenario
						<div className="text-size-xxs text-muted mt-1">
							Probably referees to a .lng file with loading screen hints
						</div>
					</Col>
					<Col xs="2" className="text-right">
						<Form.Check
							className="pull-right"
							type="switch"
							id={`loading_screens-switch-${nanoid(5)}`}
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
					id={`loading_screens-${nanoid(5)}`}
					aria-placeholder={props.value}
					value={value}
					onChange={e => setValue(e.target.value.replace(/['"]+/ig, ``))}
				/>
			</Card.Body>
		</Card>
	);
};

// Properties validation
LoadingScreen.propTypes = {
	value: PropTypes.bool,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default LoadingScreen;
