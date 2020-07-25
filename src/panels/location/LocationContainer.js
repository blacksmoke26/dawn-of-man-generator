// @flow

import React, { useState, useCallback, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { ButtonGroup, Button, Tabs, Tab, Card } from 'react-bootstrap';
import { customAlphabet } from 'nanoid';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import xmlFormatter from 'xml-formatter';
import copyClipboard from 'clipboard-copy';

// Components
import Locations from './generators/Locations';

// Types
import type { Node } from 'react';

const LOCATIONS_MAX_COUNT: number = 9;

/**
 * LocationContainer `props` type
 * @type {Object}
 */
type Props = {};

const TabContentWrapper = ( props: Object ): Node => {
	return (
		<div style={{marginTop: '1rem'}}>
			<Card className="rounded-0">
				<Card.Body>
					{props.children}
				</Card.Body>
			</Card>
		</div>
	);
};

/**
 * LocationContainer functional component
 */
const LocationContainer = ( props: Props ): Node => {
	const [locations, setLocations] = useState({});
	const [init, setInit] = useState(false);
	const [activeKey, setActiveKey] = useState('');
	const [loading, setLoading] = useState(false);
	
	const addNewLocation = useCallback(() => {
		const id: string = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5);
		setLocations({...locations, [id]: ''});
		setActiveKey(id);
		
	}, [locations, setLocations, setActiveKey]);
	
	useEffect(() => {
		if ( !init ) { addNewLocation(); setInit(true); }
	}, [addNewLocation, init, setInit]);
	
	const toTemplate: () => string = (): string => {
		const xml: string = [
			`<locations>`,
			Object.values(locations).join(''),
			`</locations>`
		].join(``);
		
		return xmlFormatter(xml, {indentation: '  '});
	};
	
	const totalLoc: number = Object.keys(locations).length;
	
	return (
		<>
			<div className="mb-3">
				<ButtonGroup>
					<Button variant="secondary" size="sm"
						disabled={loading || totalLoc >= LOCATIONS_MAX_COUNT} onClick={() => {
						if ( totalLoc <= LOCATIONS_MAX_COUNT  ) {
							addNewLocation();
							setLoading(true);
							setTimeout(() => setLoading(false), 500);
						}
					}}>Add New</Button>
					<Button variant="danger" size="sm" disabled={loading || totalLoc <= 1 } onClick={() => {
						const key = Object.keys(locations)[0];
						setLocations({[key]: locations[key]});
						setActiveKey(key);
						setLoading(true);
						setTimeout(() => setLoading(false), 100);
					}}>Remove All</Button>
				</ButtonGroup>
			</div>
			
			<Tabs activeKey={activeKey} id="locations-tab" onSelect={k => setActiveKey(k)}>
				{Object.keys(locations).map((v, i: number) => {
					return (
						<Tab eventKey={v} key={v} as={'div'}
							title={
								<>
									<span className="text-size-sm pr-2">{v}</span>
									<Button hidden={i === 0} variant="link" className="text-color-default text-decoration-none p-0" style={{
										lineHeight: '10px',
										position: 'relative',
										top: '-2px',
									}} onClick={e => {
										e.preventDefault();
										e.stopPropagation();
										const newLocations = {...locations};
										const ky: Array<string> = Object.keys(locations);
										const idx: number = Number(ky.findIndex(val => v === val));
										delete newLocations[v];
										setLocations(newLocations);
										setActiveKey(ky[idx-1]);
									}}>&times;</Button>
								</>
							}>
							<TabContentWrapper>
								<Locations onChange={( tpl, values) => {
									setLocations({ ...locations, [v]: tpl});
								}} />
							</TabContentWrapper>
						</Tab>
					);
				})}
			</Tabs>
			<hr/>
			<SyntaxHighlighter style={githubGist} language="xml">
				{toTemplate()}
			</SyntaxHighlighter>
			<div className="mt-2">
				<Button size="sm" variant="secondary"
					onClick={() => copyClipboard(toTemplate())}>
					Copy to Clipboard
				</Button>
			</div>
		</>
	);
};

LocationContainer.defaultProps = {
};

LocationContainer.propTypes = {
	onChange: PropTypes.func,
};

export default LocationContainer;
