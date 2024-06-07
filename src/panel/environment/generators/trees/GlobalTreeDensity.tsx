/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import { nanoid } from 'nanoid';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

// components
import Slider from '~/components/ui/Slider';

// utils
import * as random from '~/utils/random';
import * as Defaults from '~/utils/defaults';

// redux
import {useAppSelector} from '~redux/hooks';
import merge from 'deepmerge';

export interface Props {
	enabled?: boolean,

	onChange(template: string, value: number): void,
}

/** GlobalTreeDensity functional component */
const GlobalTreeDensity = ( props: Props ) => {
	props = merge({
		enabled: false,
		onChange: () => {},
	}, props);

	const [value, setValue] = React.useState<number>(random.randomDensity());
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const environment = useAppSelector(({environment}) => (environment));

	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = environment?.globalTreeDensity ?? null;

		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
		}

		if ( typeof extValue === 'number' ) {
			setEnabled(true);
			setValue(extValue);
		}
	}, [environment]);

	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enabled]);

	/** Generate xml code */
	const toTemplateText = (): string => {
		return enabled
			? `<global_tree_density value="${value}"/>`
			: '';
	}

	return (
		<>
			<Card className={cn('mb-2', {'text-muted': !enabled})}>
				<Card.Body>
					<Form.Group as={Row} className="mb-2 checkbox-align">
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
								Default
							</Button>
							<Button disabled={!enabled} className="button-reset-sm" variant="link"
								onClick={() => setValue(Defaults.DENSITY_MIN)}>
								None
							</Button>
							<Slider step={0.01} disabled={!enabled} min={Defaults.DENSITY_MIN} max={Defaults.DENSITY_MAX}
								value={Number(value)} onChange={v => setValue(v as number)}/>
						</Col>
					</Form.Group>
				</Card.Body>
			</Card>
		</>
	);
};

// Properties validation
GlobalTreeDensity.propTypes = {
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default GlobalTreeDensity;
