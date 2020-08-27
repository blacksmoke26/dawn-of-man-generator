// @flow

import React from 'react';
import { ButtonGroup, Button, Tabs, Tab, Card } from 'react-bootstrap';
import { customAlphabet } from 'nanoid';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import xmlFormatter from 'xml-formatter';
import copyClipboard from 'clipboard-copy';

// Types
import type { Node } from 'react';

// Components
import Locations from './generators/Locations';

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
	const [loading, setLoading] = React.useState<boolean>(false);
	
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
	const toTemplate: () => string = (): string => {
		const xml: string = `
		<locations>
			${Object.values(locations).join('')}
		</locations>`;
		
		return xmlFormatter(xml, {indentation: '  '});
	};
	
	/** Total locations count */
	const total: number = Object.keys(locations).length;
	
	return (
		<>
			<div className="mb-3">
				<ButtonGroup>
					<Button variant="secondary" size="sm"
						disabled={loading || total >= LOCATIONS_MAX_COUNT} onClick={() => {
						if ( total <= LOCATIONS_MAX_COUNT  ) {
							addNewLocation();
							setLoading(true);
							setTimeout(() => setLoading(false), 500);
						}
					}}>Add New</Button>
					<Button variant="danger" size="sm" disabled={loading || total <= 1 } onClick={() => {
						const key = Object.keys(locations)[0];
						setLocations({[key]: locations[key]});
						setActiveKey(key);
						setLoading(true);
						setTimeout(() => setLoading(false), 100);
					}}>Remove All</Button>
				</ButtonGroup>
			</div>
			<Tabs activeKey={activeKey} id="locations-tab" onSelect={k => setActiveKey(k)}>
				{Object.keys(locations).map((v, i: number) => (
					<Tab eventKey={v} key={v} as={'div'}
						title={
							<>
								<span className="text-size-sm pr-2">#{++i}</span>
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
				))}
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
}

export default LocationContainer;
