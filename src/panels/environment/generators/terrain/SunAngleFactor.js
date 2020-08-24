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

// Components
import UiSlider from './../../../../components/UiSlider';

// Utils
import * as random from '../../../../utils/random';

const ANGLE_DEFAULT: number = 0;
const ANGLE_MAX: number = 1;

/**
 * SunAngleFactor `props` type
 * @type {Object}
 */
type Props = {
	enabled?: boolean,
	angle?: number,
	onChange ( template: string, value: number ): void,
};

/** SunAngleFactor functional component */
function SunAngleFactor ( props: Props ) {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [angle, setAngle] = React.useState<number>(props.angle);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled);
		setAngle(props.angle);
	}, [props.enabled, props.angle]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), angle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [angle, enabled]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return enabled
			? `<sun_angle_factor value="${angle}"/>`
			: '';
	}, [angle, enabled]);
	
	return (
		<Card className={cn('mb-2', {'text-muted': !enabled})}>
			<Card.Body>
				<Row className="mb-1">
					<Col xs="10">
						Sun Angle Factor <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
							{angle}
						</code>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setAngle(random.randomFloat())}>Random</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setAngle(ANGLE_MAX)}>Max</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setAngle(ANGLE_DEFAULT)}>Reset</Button>
						<div className="text-size-xxs text-muted mt-1">
							How high is the sun in the sky, 1.0 is the default.
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
				<UiSlider step={0.1} disabled={!enabled}
					value={Number(angle)} onChange={v => setAngle(v)}/>
			</Card.Body>
		</Card>
	);
}

// Default properties
SunAngleFactor.propTypes = {
	enabled: PropTypes.bool,
	angle: PropTypes.number,
	onChange: PropTypes.func,
};

// Properties validation
SunAngleFactor.defaultProps = {
	enabled: false,
	angle: random.randomFloat(),
	onChange: () => {},
};

export default SunAngleFactor;
