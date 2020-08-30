// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import cn from 'classname';

// Components
import UiSlider from './../../../../components/UiSlider';

// Utils
import * as random from '../../../../utils/random';

const DISTANCE_DEFAULT: number = 0;
const DISTANCE_MAX: number = 0;

/**
 * FordDistanceFactor `props` type
 * @type {Object}
 */
type Props = {
	enabled?: boolean,
	distance?: number,
	onChange ( template: string, values?: {[string]: any} ): void,
};

/** FordDistanceFactor functional component */
function FordDistanceFactor ( props: Props ) {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [distance, setDistance] = React.useState<number>(props.distance);
	
	const {environment} = useSelector(( {environment} ) => ({environment}));
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = environment?.fordDistanceFactor ?? null;
		
		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
		}
		
		if ( typeof extValue === 'number') {
			setEnabled(true);
			setDistance(extValue);
		}
	}, [environment]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), distance);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [distance, enabled]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return enabled
			? `<distance_height_offset value="${distance}"/>`
			: '';
	}, [distance, enabled]);
	
	return (
		<>
			<Card className={cn('mb-2', {'text-muted': !enabled})}>
				<Card.Body>
					<Row className="mb-1">
						<Col xs="10">
							Ford Distance Factor <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
								{distance}
							</code>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => setDistance(random.randomFloat())}>
								Random
							</Button>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => setDistance(DISTANCE_MAX)}>Max</Button>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => setDistance(DISTANCE_DEFAULT)}>Reset</Button>
							<div className="text-size-xxs text-muted mt-1">
								The average distance between river fords, 1.0 is the default.
							</div>
						</Col>
						<Col xs="2" className="text-right">
							<Form.Check
								className="pull-right"
								type="switch"
								id={`river-switch-${nanoid(5)}`}
								label=""
								checked={enabled}
								onChange={e => setEnabled(e.target.checked)}
							/>
						</Col>
					</Row>
					<UiSlider step={0.01} disabled={!enabled} value={distance}
						onChange={v => setDistance(v)}/>
				</Card.Body>
			</Card>
		</>
	);
}

// Default properties
FordDistanceFactor.propTypes = {
	distance: PropTypes.number,
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

// Properties validation
FordDistanceFactor.defaultProps = {
	enabled: false,
	distance: random.randomFloat(),
	onChange: () => {},
};

export default FordDistanceFactor;
