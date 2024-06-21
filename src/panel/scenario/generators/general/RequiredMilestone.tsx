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

// parsers
import {toRequiredMilestoneTemplate} from '~/utils/parser/templates-general';

/** RequiredMilestone `props` type */
interface Props {
	enabled?: boolean,
	value?: number,

	onChange?(template: string, value: number): void,
}

/** RequiredMilestone functional component */
const RequiredMilestone = ( props: Props ) => {
	props = merge({
		value: 3,
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<number>(props.value as number);
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const requiredMilestonesAttribute = useAppSelector(({scenario}) => scenario.values?.requiredMilestones);
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = requiredMilestonesAttribute ?? null;
		
		if ( !extValue || !parseInt(String(extValue)) ) {
			setEnabled(!!extValue);
		} else {
			setValue(extValue as number);
		}
	}, [requiredMilestonesAttribute]);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled as boolean);
	}, [props.enabled]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(
			toRequiredMilestoneTemplate(value, enabled), value
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);
	
	return (
		<div className={cn('mb-2', {'text-muted': !enabled}, 'checkbox-align')}>
			<Row className="mb-1">
				<Col xs="10">
					Required Milestones
					<div className="text-size-xxs text-muted mt-1">
						Milestones needed for the scenario to count as completed, so that depending scenarios can be started.
					</div>
				</Col>
				<Col xs="2" className="text-right">
					<Form.Check
						className="pull-right"
						type="switch"
						id={`required_milestones-switch-${nanoid(5)}`}
						label=""
						checked={enabled}
						onChange={e => setEnabled(e.target.checked)}
					/>
				</Col>
			</Row>
			<Form.Control
				type="number"
				disabled={!enabled}
				className="pull-right"
				aria-disabled={!enabled}
				id={`required_milestones-${nanoid(5)}`}
				value={value}
				pattern="^[0-9]+$"
				min="1"
				max="20"
				maxLength={2}
				onChange={e => {
					const num = parseInt(e.target.value.trim());
					setValue(!num ? 0 : (num > 20 ? 20 : num));
				}}
			/>
		</div>
	);
};

// Properties validation
RequiredMilestone.propTypes = {
	value: PropTypes.bool,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default RequiredMilestone;
