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
import * as random from '../../../../utils/scenario/random';
import * as Defaults from '../../../../utils/scenario/defaults';

/**
 * MapSize `props` type
 * @type {Object}
 */
type Props = {
	enabled?: boolean,
	value?: number,
	onChange ( template: string, value: number ): void,
};

/** MapSize functional component */
function MapSize ( props: Props ) {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [value, setValue] = React.useState<number>(props.value);
	
	const {scenario} = useSelector(( {scenario} ) => ({scenario}));
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = scenario?.size ?? null;
		
		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
		}
		
		if ( typeof extValue === 'number') {
			setEnabled(true);
			setValue(extValue);
		}
	}, [scenario]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return enabled
			? `<size value="${value}"/>`
			: '';
	}, [value, enabled]);
	
	return (
		<>
			<Card className={cn('mb-2', {'text-muted': !enabled})}>
				<Card.Body>
					<Row className="mb-1">
						<Col xs="10">
							Map size <code className={cn('text-size-xs', {'text-muted': !enabled})}>
								{value}
							</code>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => setValue(random.randomMapSize())}>
								Random
							</Button>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => setValue(Defaults.MAP_SIZE_DEFAULT)}>Default</Button>
							<div className="text-size-xxs text-muted mt-1">
								Defines the size of the map, beware that big maps can drain performance.
							</div>
						</Col>
						<Col xs="2" className="text-right">
							<Form.Check
								className="pull-right"
								type="switch"
								id={`size-switch-${nanoid(5)}`}
								label=""
								checked={enabled}
								onChange={e => setEnabled(e.target.checked)}
							/>
						</Col>
					</Row>
					<UiSlider
						min={Defaults.MAP_SIZE_MIN}
						max={Defaults.MAP_SIZE_MAX}
						step={1} disabled={!enabled}
						value={Number(value)} onChange={v => setValue(v)}/>
				</Card.Body>
			</Card>
		</>
	);
}

// Default properties
MapSize.propTypes = {
	enabled: PropTypes.bool,
	value: PropTypes.number,
	onChange: PropTypes.func,
};

// Properties validation
MapSize.defaultProps = {
	enabled: true,
	value: Defaults.MAP_SIZE_DEFAULT,
	onChange: () => {},
};

export default MapSize;
