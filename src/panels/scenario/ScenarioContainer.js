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
import type { LocationProps } from './../../utils/location';

// Components
import LocationContainer from './generators/location/LocationContainer';

// Utils
import { nodesToLanguageStrings } from './../../utils/location';

const SCENARIO_NAME: string = 'scenario';

/** ScenarioContainer functional component */
function ScenarioContainer (): Node {
	const [locations, setLocations] = React.useState<string>('');
	const [langStrings, setLangStrings] = React.useState<Object>({});
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		const xml: string = `
		<?xml version="1.0" encoding="utf-8"?>
		<scenario>
			${locations}
		</scenario>`;
		
		return xmlFormatter(xml, {indentation: '  '});
	}, [locations]);
	
	/** Generate language string xml code */
	const toLanguageTemplateText = React.useCallback((): string => {
		const data: Array<string> = [];
		
		for ( let nodes of Object.values(langStrings) ) {
			for ( let [key, label] of Object.entries(nodes) ) {
				data.push(`<string name="${key}">${label}</string>`)
			}
		}
		
		return xmlFormatter(`
			<?xml version="1.0" encoding="utf-8"?>
			<strings>${data.join('')}</strings>
		`, {indentation: '  ', collapseContent: true});
	}, [langStrings]);
	
	/** Update language strings data */
	const updateLangString = React.useCallback(( name: string, data: string ): void => {
		setLangStrings(current => ({
			...current,
			[name]: data,
		}));
	}, []);
	
	/** Download file button click handler */
	const downloadFileClick = React.useCallback((): void => {
		var blob = new Blob([toTemplateText()], {type: 'text/xml;charset=utf-8'});
		FileSaver.saveAs(blob, `${SCENARIO_NAME}.xml`);
	}, [locations]);
	
	/** Download language file button click handler */
	const downloadLanguageFileClick = React.useCallback((): void => {
		var blob = new Blob([toLanguageTemplateText()], {type: 'text/xml;charset=utf-8'});
		FileSaver.saveAs(blob, `en_${SCENARIO_NAME}.xml`);
	}, [langStrings]);
	
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
							<LocationContainer onChange={( template: string, list: Array<LocationProps> ) => {
								setLocations(template);
								updateLangString('locations', nodesToLanguageStrings(list));
							}}/>
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
						onClick={() => downloadFileClick()}>
						Download File
					</Button>
				</ButtonGroup>
			</div>
			<hr/>
			<div className="syntax-highlighter">
				<SyntaxHighlighter style={anOldHope} language="xml">
					{toLanguageTemplateText()}
				</SyntaxHighlighter>
			</div>
			<div className="mt-2">
				<ButtonGroup size="sm">
					<Button variant="secondary"
						onClick={() => copyClipboard(toLanguageTemplateText())}>
						Copy to Clipboard
					</Button>
					<Button variant="secondary"
						onClick={() => downloadLanguageFileClick()}>
						Download File
					</Button>
				</ButtonGroup>
			</div>
		</>
	);
}

export default ScenarioContainer;
