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

// Utils
import * as random from '../../../../utils/random';

/**
 * Trees `props` type
 * @type {Object}
 */
type Props = {
	enable: boolean,
	onChange ( template: string, values?: {[string]: any} ): void,
};

/** Trees functional component */
function Trees ( props: Props ) {
	const [trees, setTrees] = React.useState<string[]>(random.randomTrees());
	const [enable, setEnable] = React.useState<boolean>(props.enable);
	
	const {extValue} = useSelector(( {environment} ) => ({
		extValue: environment?.trees ?? null,
	}));
	
	// Reflect attributes changes
	React.useEffect(() => {
		if ( typeof extValue === 'boolean' ) {
			setEnable(extValue);
		}
		
		if ( Array.isArray(extValue) ) {
			setEnable(true);
			setTrees(extValue);
		}
	}, [extValue]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), trees);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trees, enable]);
	
	const toTemplateText = (): string => {
		return !trees.length || !enable
			? ''
			: `<trees values="${trees.join(' ')}"/>`;
	}
	
	return (
		<>
			<Card className={cn('mb-2', {'text-muted': !enable})}>
				<Card.Body>
					<Row className="mb-1">
						<Col xs="10">
							Present Trees {' '}
							<code className="pl-2 text-size-xs">
								{!trees.length ? '<None>' : trees.join(' ').trim()}
						</code>
							<Button disabled={!enable} className="button-reset-sm" variant="link"
								onClick={() => setTrees(random.randomTrees())}>
								Random
							</Button>
							<Button disabled={!enable} className="button-reset-sm" variant="link"
								onClick={() => setTrees([...random.trees])}>All</Button>
							<Button disabled={!enable} className="button-reset-sm" variant="link"
								onClick={() => setTrees([])}>None</Button>
							<div className="text-size-xxs text-muted mt-1">
								What trees are present in the level.
							</div>
						</Col>
						<Col xs="2" className="text-right">
							<Form.Check
								className="pull-right"
								type="switch"
								id={`trees-present-switch-${nanoid(5)}`}
								label=""
								checked={enable}
								onChange={e => setEnable(e.target.checked)}
							/>
						</Col>
					</Row>
					<ul className="list-unstyled list-inline fixed-width mb-0">
						{random.trees.map(v => (
							<li key={v} className="list-inline-item mb-1">
								<Form.Check
									disabled={!enable}
									custom
									data-value={v}
									checked={trees.findIndex(val => v === val) !== -1}
									id={`trees_${v}`}
									label={v}
									onChange={(e: Event) => {
										const list = trees.filter(val => val !== e.target.getAttribute('data-value'));
										e.target.checked && list.push(v);
										setTrees([...list]);
									}}
								/>
							</li>
						))}
					</ul>
				</Card.Body>
			</Card>
		</>
	);
}

// Properties validation
Trees.defaultProps = {
	enable: false,
	onChange: () => {},
};

// Default properties
Trees.propTypes = {
	enable: PropTypes.bool,
	onChange: PropTypes.func,
};

export default Trees;
