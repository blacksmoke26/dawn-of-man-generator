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
import * as random from './../../../../utils/random';
import * as Defaults from './../../../../utils/defaults';

/**
 * ResourceFactor `props` type
 * @type {Object}
 */
type Props = {
	enabled?: boolean,
	resource?: number,
	onChange ( template: string, value: number ): void,
};

/** ResourceFactor functional component */
function ResourceFactor ( props: Props ) {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [resource, setResource] = React.useState<number>(props.resource);
	
	const {extValue} = useSelector(( {environment} ) => ({
		extValue: environment?.resourceFactor ?? null,
	}));
	
	// Reflect attributes changes
	React.useEffect(() => {
		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
		}
		
		if ( typeof extValue === 'number') {
			setEnabled(true);
			setResource(extValue);
		}
	}, [extValue]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), resource);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resource, enabled]);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		return enabled
			? `<resource_factor value="${resource}"/>`
			: '';
	}, [resource, enabled]);
	
	return (
		<Card className={cn('mb-2', {'text-muted': !enabled})}>
			<Card.Body>
				<Row className="mb-1">
					<Col xs="10">
						Resource Factor <code className={cn('pl-2 text-size-xs', {'text-muted': !enabled})}>
							{resource}
						</code>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setResource(random.randomResource())}>
							Random
						</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setResource(Defaults.RESOURCE_FACTOR_DEFAULT)}>Default</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setResource(Defaults.RESOURCE_FACTOR_MAX)}>Max</Button>
						<Button disabled={!enabled} className="button-reset-sm" variant="link"
							onClick={() => setResource(Defaults.RESOURCE_FACTOR_MIN)}>None</Button>
						<div className="text-size-xxs text-muted mt-1">
							The amount of resources in the map. 1 is the default.
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
				<UiSlider step={0.01}
					min={0}
					max={100}
					disabled={!enabled} value={Number(resource)}
					onChange={v => setResource(v)}/>
			</Card.Body>
		</Card>
	);
}

// Properties validation
ResourceFactor.propTypes = {
	enabled: PropTypes.bool,
	resource: PropTypes.number,
	onChange: PropTypes.func,
};

// Default properties
ResourceFactor.defaultProps = {
	enabled: false,
	resource: random.randomResource(),
	onChange: () => {},
};

export default ResourceFactor;
