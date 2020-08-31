// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-10
 */

import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Card, Accordion, Button, ButtonGroup } from 'react-bootstrap';
import { anOldHope } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import xmlFormatter from 'xml-formatter';
import copyClipboard from 'clipboard-copy';
import FileSaver from 'file-saver';

// Types
import type { Node } from 'react';

// Components
import LocationContainer from './generators/location/LocationContainer';

/** ScenarioContainer functional component */
function ScenarioContainer (): Node {
	const [locations, setLocations] = React.useState<string>('');
	
	/** Generate xml code */
	const toTemplateText = (): string => {
		const xml: string = `
		<?xml version="1.0" encoding="utf-8"?>
		<scenario>
			${locations}
		</scenario>`;
		
		return xmlFormatter(xml, {indentation: '  '});
	}
	
	return (
		<>
			<Accordion activeKey="locations">
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2 position-relative">
						<Accordion.Toggle as={Button} variant="link" eventKey="locations">
							Locations
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="locations">
						<Card.Body>
							<LocationContainer onChange={v => setLocations(v)}/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
			<hr/>
			<div className="syntax-highlighter">
				<SyntaxHighlighter style={anOldHope} language="xml">
					{toTemplateText()}
				</SyntaxHighlighter>
			</div>
			<div className="mt-2">
				<ButtonGroup size="sm">
					<Button variant="secondary"
						onClick={() => copyClipboard(toTemplateText())}>
						Copy to Clipboard
					</Button>
					<Button variant="secondary"
						onClick={() => {
							var blob = new Blob([toTemplateText()], {type: 'text/xml;charset=utf-8'});
							FileSaver.saveAs(blob, 'my-scenario.xml');
						}}>
						Download File
					</Button>
				</ButtonGroup>
			</div>
		</>
	);
}

export default ScenarioContainer;
