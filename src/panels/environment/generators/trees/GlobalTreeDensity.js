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
import * as random from './../../../../utils/random';
import * as Defaults from './../../../../utils/defaults';

/**
 * GlobalTreeDensity `props` type
 * @type {Object}
 */
type Props = {
	enabled: boolean,
	onChange ( template: string, value: number ): void,
};

/** GlobalTreeDensity functional component */
function GlobalTreeDensity ( props: Props ): Node {
	const [value, setValue] = React.useState<number>(random.randomDensity());
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnabled(props.enabled);
	}, [props.enabled]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);
	
	const toTemplateText = (): string => {
		return enabled
			? `<global_tree_density value="${value}"/>`
			: '';
	}
	
	return (
		<>
			<Card className={cn('mb-2', {'text-muted': !enabled})}>
				<Card.Body>
					<Form.Group as={Row} className="mb-2">
						<Form.Label column={true} sm="3">
							<Form.Check
								type="switch"
								id={`global_tree_density-switch-${nanoid(5)}`}
								label={
									<span style={{textDecoration: 'underline dotted'}}
									 title="The global tree density in the environment.">
										Global Tree Density:
									</span>
								}
								onChange={e => setEnabled(Boolean(e.target.checked))}
							/>
						</Form.Label>
						<Col sm="9">
								<span className="text-size-xs font-family-code">
									Value: <code>{value}</code>
								</span>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => setValue(random.randomDensity())}>
								Random
							</Button>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => setValue(Defaults.DENSITY_DEFAULT)}>
								Reset
							</Button>
							<UiSlider step={0.01} disabled={!enabled} min={Defaults.DENSITY_MIN} max={Defaults.DENSITY_MAX}
								value={Number(value)} onChange={v => setValue(v)}/>
						</Col>
					</Form.Group>
				</Card.Body>
			</Card>
		</>
	);
}

// Properties validation
GlobalTreeDensity.propTypes = {
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

// Default properties
GlobalTreeDensity.defaultProps = {
	enabled: false,
	onChange: () => {},
};

export default GlobalTreeDensity;
