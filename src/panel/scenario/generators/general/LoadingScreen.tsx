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

// elemental components
import TextInput from '~/components/ui/TextInput';

// redux
import {useAppSelector} from '~redux/hooks';

// parsers
import {toLoadingScreenTemplate} from '~/utils/parser/templates-general';

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

	const loadingScreenAttribute = useAppSelector(({scenario}) => scenario?.values?.loadingScreen);
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = loadingScreenAttribute ?? null;
		
		if ( !extValue ) {
			setEnabled(false);
		} else {
			setValue(extValue as string);
		}
	}, [loadingScreenAttribute]);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled as boolean);
	}, [props.enabled]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(
			toLoadingScreenTemplate(value, enabled), value
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);
	
	return (
		<div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
			<Row className="mb-1">
				<Col xs="10">
					Loading Screens
					<div className="text-size-xxs text-muted mt-1">
						Referees to the loading screen images
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
			<TextInput
				caseType="SNAKE_CASE"
				disabled={!enabled}
				value={value}
				placeholder="e.g., map_the_northlands"
				onChange={theValue => setValue(theValue as string)}/>
		</div>
	);
};

// Properties validation
LoadingScreen.propTypes = {
	value: PropTypes.string,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default LoadingScreen;
