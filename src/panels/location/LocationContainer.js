// @flow

import React from 'react';
import { ButtonGroup, Button, Tabs, Tab, Card } from 'react-bootstrap';
import { customAlphabet } from 'nanoid';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { anOldHope } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import xmlFormatter from 'xml-formatter';
import copyClipboard from 'clipboard-copy';
import FileSaver from 'file-saver';

// Types
import type { Node } from 'react';

// Components
import Location from './generators/Location';

// Utils
import * as location from './../../utils/location';

const randAlpha: Function = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5);

/** Maximum limit of locations tabs */
const LOCATIONS_MAX_COUNT: number = 12;

/** Tab contents wrapper */
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

/** LocationContainer functional component */
function LocationContainer (): Node {
	const [locations, setLocations] = React.useState<Object>({});
	const [init, setInit] = React.useState<boolean>(false);
	const [activeKey, setActiveKey] = React.useState<string>('');
	
	React.useEffect(() => {
		if ( !init ) {
			setInit(true);
			addNewLocation();
		}
	}, [init]);
	
	/** Add new location */
	const addNewLocation = (): void => {
		const id: string = randAlpha();
		setLocations(current => ({...current, [id]: ''}));
		setActiveKey(id);
	};
	
	/** Generate xml code */
	const toTextTemplate = ( fileMarkup: boolean = false ): string => {
		const locationsTemplate: string = (
			`<locations>${Object.values(locations).join('')}</locations>`
		);
		
		const template: string = fileMarkup
			? (
				`<?xml version="1.0" encoding="utf-8"?>
				<scenario>
					${locationsTemplate}
				</scenario>
				`
			)
			: `${locationsTemplate}`
		
		return xmlFormatter(template, {indentation: '  '});
	};
	
	/** Total locations count */
	const total: number = Object.keys(locations).length;
	
	return (
		<>
			<div className="mb-3">
				<ButtonGroup>
					<Button variant="secondary" size="sm"
						disabled={total >= LOCATIONS_MAX_COUNT} onClick={() => {
						if ( total <= LOCATIONS_MAX_COUNT  ) {
							addNewLocation();
						}
					}}>Add New</Button>
					<Button variant="danger" size="sm" disabled={total <= 1 } onClick={() => {
						const key = Object.keys(locations)[0];
						setLocations({[key]: locations[key]});
						setActiveKey(key);
					}}>Remove All</Button>
				</ButtonGroup>
			</div>
			<Tabs activeKey={activeKey} id="locations-tab" className="nav-tabs-bottom" onSelect={k => setActiveKey(k)}>
				{Object.keys(locations).map((v, i: number) => (
					<Tab eventKey={v} key={v} as={'div'}
						title={
							<>
								<span className="text-size-sm pr-2">#{i+1}</span>
								<Button hidden={i === 0} variant="link"
									className="text-color-default text-decoration-none p-0" style={{
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
							<Location values={location.randomizeLocation()} onChange={template => {
								setLocations(current => ({
									...current,
									[v]: template,
								}));
							}}/>
						</TabContentWrapper>
					</Tab>
				))}
			</Tabs>
			<hr/>
			<div className="syntax-highlighter">
				<SyntaxHighlighter style={anOldHope} language="xml">
					{toTextTemplate()}
				</SyntaxHighlighter>
			</div>
			<div className="mt-2">
				<ButtonGroup size="sm">
					<Button variant="secondary"
						onClick={() => copyClipboard(toTextTemplate())}>
						Copy to Clipboard
					</Button>
					<Button variant="secondary"
						onClick={() => {
							var blob = new Blob([toTextTemplate(true)], {type: 'text/xml;charset=utf-8'});
							FileSaver.saveAs(blob, 'my-scenario.xml');
						}}>
						Download File
					</Button>
				</ButtonGroup>
			</div>
		</>
	);
}

export default LocationContainer;
