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

// Utils
import * as random from '../../../../utils/random';

/**
 * TreesEverywhere `props` type
 * @type {Object}
 */
type Props = {
	enable: boolean,
	onChange ( template: string, value: boolean ): void,
};

/** TreesEverywhere functional component */
function TreesEverywhere ( props: Props ): Node {
	const [value, setValue] = React.useState<boolean>(random.randomTreesEverywhere());
	const [enable, setEnable] = React.useState<boolean>(props.enable);
	
	// Reflect attributes changes
	React.useEffect(() => {
		setEnable(props.enable);
	}, [props.enable]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, enable]);
	
	const toTemplateText = (): string => {
		return !enable
			? ''
			: `<trees_everywhere value="${value ? 'true' : 'false'}"/>`;
	};
	
	return (
		<>
			<Card className={cn('mb-2', {'text-muted': !enable})}>
				<Card.Body>
					<Row className="mb-1">
						<Col xs="10">
							Trees Everywhere <code className="pl-2 text-size-xs">{value ? '<True>' : '<False>'}</code>
							<Button disabled={!enable} className="button-reset-sm" variant="link"
								onClick={() => setValue(random.randomTreesEverywhere())}>
								Random
							</Button>
							<Button disabled={!enable} className="button-reset-sm" variant="link"
								onClick={() => setValue(false)}>None</Button>
						</Col>
						<Col xs="2" className="text-right">
							<Form.Check
								className="pull-right"
								type="switch"
								id={`trees_everywhere-switch-${nanoid(5)}`}
								label=""
								checked={enable}
								onChange={e => setEnable(e.target.checked)}
							/>
						</Col>
					</Row>
					<Form.Check
						custom
						className="pull-right"
						disabled={!enable}
						id={`trees_everywhere-${nanoid(5)}`}
						label="Show everywhere?"
						checked={value}
						onChange={e => setValue(e.target.checked)}
					/>
				</Card.Body>
			</Card>
		</>
	);
}

// Default properties
TreesEverywhere.propTypes = {
	enable: PropTypes.bool,
	onChange: PropTypes.func,
};

// Properties validation
TreesEverywhere.defaultProps = {
	enable: false,
	onChange: () => {},
};

export default TreesEverywhere;
