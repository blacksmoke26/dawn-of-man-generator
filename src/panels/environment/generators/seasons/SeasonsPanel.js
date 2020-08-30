// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-07
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Button, Form, Accordion, ButtonGroup } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import cn from 'classname';

// Types
import { Node } from 'react';
import type { SeasonsProp } from './../../../../utils/seasons';

// Components
import Spring from './Spring';
import Summer from './Summer';
import Fall from './Fall';
import Winter from './Winter';

// Utils
import { seasonsPropsDefault, seasonsPropsRandomize } from './../../../../utils/seasons';
import { isObject } from './../../../../data/environments/parser/utils/transform';

/** Export values */
type ExportValues = {
	spring: Object,
	summer: Object,
	fall: Object,
	winter: Object,
};

/**
 * Seasons `props` type
 * @type {Object}
 */
type Props = {
	enabled: boolean,
	onChange ( template: string, values: ExportValues ): void,
};

/** SeasonsPanel functional component */
function SeasonsPanel ( props: Props ): Node {
	const [enabled, setEnabled] = React.useState<boolean>(props.enabled);
	const [spring, setSpring] = React.useState<string>('');
	const [summer, setSummer] = React.useState<string>('');
	const [fall, setFall] = React.useState<string>('');
	const [winter, setWinter] = React.useState<string>('');
	const [seasonProps, setSeasonProps] = React.useState<SeasonsProp>(seasonsPropsDefault());
	
	const {spring: springConfig, summer: summerConfig, fall: fallConfig, winter: winterConfig} = seasonProps;
	
	const {environment} = useSelector(( {environment} ) => ({environment}));
	
	// Reflect attributes changes
	React.useEffect(() => {
		const extValue = environment?.seasons ?? null;
		
		if ( typeof extValue === 'boolean' ) {
			setEnabled(extValue);
		}
		
		if ( isObject(extValue) && Object.keys(extValue).length ) {
			setEnabled(true);
		}
	}, [environment]);
	
	// Reflect state changes
	React.useEffect(() => {
		typeof props.onChange === 'function' && props.onChange(toTemplateText(), {
			spring, summer, fall, winter,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enabled, spring, summer, fall, winter]);
	
	/** Generate xml code */
	const toTemplateText = (): string => {
		return enabled
			? (
				`<seasons>
					${spring} ${summer} ${fall} ${winter}
				</seasons>`
			) : '';
	};
	
	return (
		<>
			<div className="mb-3">
				<Form.Check
					className="pull-right"
					type="switch"
					id={`seasons_override-switch-${nanoid(5)}`}
					label="Override seasons"
					checked={enabled}
					onChange={e => setEnabled(e.target.checked)}
				/>
			</div>
			<Accordion className={(cn({'text-muted': !enabled}))}>
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2">
						<Accordion.Toggle disabled={!enabled} as={Button} variant="link" eventKey="seasons_spring">
							Spring
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="seasons_spring">
						<Card.Body>
							<Spring season={springConfig} onChange={v => setSpring(v)} enabled={enabled}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2">
						<Accordion.Toggle disabled={!enabled} as={Button} variant="link" eventKey="seasons_summer">
							Summer
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="seasons_summer">
						<Card.Body>
							<Summer season={summerConfig} onChange={v => setSummer(v)} enabled={enabled}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2">
						<Accordion.Toggle disabled={!enabled} as={Button} variant="link" eventKey="seasons_fall">
							Fall
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="seasons_fall">
						<Card.Body>
							<Fall season={fallConfig} onChange={v => setFall(v)} enabled={enabled}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2">
						<Accordion.Toggle disabled={!enabled} as={Button} variant="link" eventKey="seasons_winter">
							Winter
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="seasons_winter">
						<Card.Body>
							<Winter season={winterConfig} onChange={v => setWinter(v)} enabled={enabled}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
			
			<div className="mt-2">
				<ButtonGroup>
					<Button disabled={!enabled} variant="secondary" size="sm"
						onClick={() => {
							setSeasonProps(seasonsPropsRandomize());
						}}>Randomize All</Button>
					<Button disabled={!enabled} variant="secondary" size="sm"
						onClick={() => {
							setSeasonProps(seasonsPropsDefault());
						}}>Set Defaults</Button>
				</ButtonGroup>
			</div>
		</>
	);
}

// Properties validation
SeasonsPanel.propTypes = {
	enabled: PropTypes.bool,
	onChange: PropTypes.func,
};

// Default properties
SeasonsPanel.defaultProps = {
	enabled: false,
	onChange: () => {
	},
};

export default SeasonsPanel;
