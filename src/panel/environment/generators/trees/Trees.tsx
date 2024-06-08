/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classname';
import merge from 'deepmerge';
import { nanoid } from 'nanoid';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

// Utils
import * as random from '~/utils/random';

// types
import {Json} from '~/types/json.types';

// redux
import {useAppSelector} from '~redux/hooks';

export interface Props {
	enabled?: boolean,
	onChange(template: string, values?: Json): void,
}

/** Trees functional component */
const Trees = ( props: Props ) => {
	props = merge({
		enabled: false,
		onChange: () => {},
	}, props);

	const [trees, setTrees] = React.useState<string[]>(random.randomTrees());
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled as boolean);

	const environment = useAppSelector(({environment}) => (environment));

	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = environment?.trees ?? null;

		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
		}

		if ( Array.isArray(extValue) ) {
			setEnabled(true);
			setTrees(extValue);
		}
	}, [environment]);

	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), trees);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trees, enabled]);

	const toTemplateText = (): string => {
		return !trees.length || !enabled
			? ''
			: `<trees values="${trees.join(' ')}"/>`;
	}

	return (
		<div className={cn('mb-2', {'text-muted': !enabled})}>
			<Row className="mb-1">
				<Col xs="10">
					Present Trees {' '}
					<code className="pl-2 text-size-xs">
						{!trees.length ? '<None>' : trees.join(' ').trim()}
					</code>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
									onClick={() => setTrees(random.randomTrees())}>
						Random
					</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
									onClick={() => setTrees([...random.trees])}>All</Button>
					<Button disabled={!enabled} className="button-reset-sm" variant="link"
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
						checked={enabled}
						onChange={e => setEnabled(e.target.checked)}
					/>
				</Col>
			</Row>
			<ul className="list-unstyled list-inline fixed-width mb-0 checkbox-align">
				{random.trees.map(v => (
					<li key={v} className="list-inline-item mb-1">
						<Form.Check
							disabled={!enabled}
							type="switch"
							data-value={v}
							checked={trees.findIndex(val => v === val) !== -1}
							id={`trees_${v}`}
							label={v}
							onChange={(e) => {
								const list = trees.filter(val => val !== e.target.getAttribute('data-value'));
								e.target.checked && list.push(v);
								setTrees([...list]);
							}}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};

// Properties validation
Trees.propTypes = {
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

export default Trees;
