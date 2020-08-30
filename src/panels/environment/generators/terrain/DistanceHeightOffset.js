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
const DISTANCE_MAX: number = 1;

/**
 * DistanceHeightOffset `props` type
 * @type {Object}
 */
type Props = {
	enabled?: boolean,
	distance?: number,
	onChange ( template: string, value: number ): void,
};

/** DistanceHeightOffset functional component */
function DistanceHeightOffset ( props: Props ) {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [distance, setDistance] = React.useState<number>(props.distance);
	
	const {extValue} = useSelector(( {environment} ) => ({
		extValue: environment?.distanceHeightOffset ?? null,
	}));
	
	// Reflect attributes changes
	React.useEffect(() => {
		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
		}
		
		if ( typeof extValue === 'number') {
			setEnabled(true);
			setDistance(extValue);
		}
	}, [extValue]);
	
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
							Distance Height Offset <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
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
								How much bigger are mountains at the edge of map.
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
					<UiSlider step={0.01} disabled={!enabled}
						value={Number(distance)} onChange={v => setDistance(v)}/>
				</Card.Body>
			</Card>
		</>
	);
}

// Default properties
DistanceHeightOffset.propTypes = {
	enabled: PropTypes.bool,
	distance: PropTypes.number,
	onChange: PropTypes.func,
};

// Properties validation
DistanceHeightOffset.defaultProps = {
	enabled: false,
	distance: random.randomFloat(),
	onChange: () => {},
};

export default DistanceHeightOffset;
