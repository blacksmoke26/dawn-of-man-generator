/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import {nanoid} from 'nanoid';
import {Button, Col, Form, Row} from 'react-bootstrap';

// utils
import * as random from '~/utils/random';

// redux
import {useAppSelector} from '~redux/hooks';

export interface Props {
	enabled?: boolean,
	onChange?(template: string, value: boolean): void,
}

/** TreesEverywhere functional component */
const TreesEverywhere = ( props: Props ) => {
	props = merge({
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<boolean>(random.randomTreesEverywhere());
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const environment = useAppSelector(({environment}) => (environment));

	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = environment?.treesEverywhere ?? null;

		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
			setValue(extValue);
		}
	}, [environment]);

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
			: `<trees_everywhere value="${value ? 'true' : 'false'}"/>`;
	};

	return (
		<div className={cn('mb-2 checkbox-align', {'text-muted': !enabled})}>
			<Row className="mb-1">
				<Col xs="10">
					Trees Everywhere <code className={cn('ml-1 text-size-xs', {'text-muted': !enabled})}>
					{value ? '<true>' : '<false>'}
				</code>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
									onClick={() => setValue(random.randomTreesEverywhere())}>
						Random
					</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
									onClick={() => setValue(false)}>None</Button>
				</Col>
				<Col xs="2" className="text-right">
					<Form.Check
						className="pull-right"
						type="switch"
						id={`trees_everywhere-switch-${nanoid(5)}`}
						label=""
						checked={enabled}
						onChange={e => setEnabled(e.target.checked)}
					/>
				</Col>
			</Row>
			<Form.Check
				type="switch"
				className="pull-right"
				disabled={!enabled}
				id={`trees_everywhere-${nanoid(5)}`}
				label="Show everywhere?"
				checked={value}
				onChange={e => setValue(e.target.checked)}
			/>
		</div>
	);
};

// Properties validation
TreesEverywhere.propTypes = {
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default TreesEverywhere;
