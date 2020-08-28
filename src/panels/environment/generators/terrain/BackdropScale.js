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

/**
 * BackdropScale `props` type
 * @type {Object}
 */
type Props = {
	enabled: boolean,
	angle1?: number,
	angle2?: number,
	angle3?: number,
	onChange ( template: string, values?: {[string]: any} ): void,
};

/** Default values */
const defaultValues: Object = {
	angle1: 1.0,
	angle2: 0.25,
	angle3: 1.0,
}

/** BackdropScale functional component */
function BackdropScale ( props: Props ) {
	const [enabled, setEnabled] = React.useState<number>(props.enabled);
	const [angle1, setAngle1] = React.useState<number>(props.angle1);
	const [angle2, setAngle2] = React.useState<number>(props.angle2);
	const [angle3, setAngle3] = React.useState<number>(props.angle3);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled);
		setAngle1(props.angle1);
		setAngle2(props.angle2);
		setAngle3(props.angle3);
	}, [props.enabled, props.angle1, props.angle2, props.angle3]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), {angle1, angle2, angle3});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enabled, angle1, angle2, angle3]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return enabled
			? `<backdrop_scale value="${angle1}, ${angle2}, ${angle3}"/>`
			: '';
	}, [enabled, angle1, angle2, angle3]);
	
	return (
		<>
			<Card className="mb-2">
				<Card.Body>
					<Row className="mb-1">
						<Col xs="10" className={cn({'text-muted': !enabled})}>
							Backdrop Scale <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
							{angle1}, {angle2}, {angle3}
						</code>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => {
									const rand = random.randomBackdropScale();
									setAngle1(rand[0]); setAngle2(rand[1]); setAngle3(rand[2]);
								}}>
								Random
							</Button>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => {
									setAngle1(defaultValues.angle1);
									setAngle2(defaultValues.angle2);
									setAngle3(defaultValues.angle3);
								}}>Reset</Button>
							<div className="text-size-xxs text-muted mt-1">
								Change the size of backdrops (the mountains you see beyond the map).
							</div>
						</Col>
						<Col xs="2" className="text-right">
							<Form.Check
								className="pull-right"
								type="switch"
								id={`backdrop_scale-switch-${nanoid(5)}`}
								label=""
								checked={enabled}
								onChange={e => setEnabled(e.target.checked)}
							/>
						</Col>
					</Row>
					<div className="mb-2">
						<UiSlider disabled={!enabled} step={0.01} value={Number(angle1)}
							onChange={v => setAngle1({angle1: v})}/>
					</div>
					<div className="mb-2">
						<UiSlider disabled={!enabled} step={0.01} value={Number(angle2)}
							onChange={v => setAngle2({angle2: v})}/>
					</div>
					<div className="mb-2">
						<UiSlider disabled={!enabled} step={0.01} value={Number(angle3)}
							onChange={v => setAngle3({angle3: v})}/>
					</div>
				</Card.Body>
			</Card>
		</>
	);
}

// Default properties
BackdropScale.propTypes = {
	enabled: PropTypes.bool,
	angle1: PropTypes.number,
	angle2: PropTypes.number,
	angle3: PropTypes.number,
	onChange: PropTypes.func,
};

// Properties validation
BackdropScale.defaultProps = {
	enabled: false,
	...defaultValues,
	onChange: () => {},
};

export default BackdropScale;
