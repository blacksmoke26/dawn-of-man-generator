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
import MapSize from './generators/general/MapSize';
import HardcoreModeAllowed from './generators/general/HardcoreModeAllowed';
import NomadModeAllowed from './generators/general/NomadModeAllowed';
import ShowCompletionIcon from './generators/general/ShowCompletionIcon';
import LocationContainer from './generators/location/LocationContainer';

// Utils
import { nodesToLanguageStrings } from './../../utils/location';

const SCENARIO_NAME: string = 'scenario';

/** ScenarioContainer functional component */
function ScenarioContainer (): Node {
	const [templateTexts, setTemplateTexts] = React.useState<Object>({});
	const [langStrings, setLangStrings] = React.useState<Object>({});
	
	/** Update templates raw texts */
	const updateText = React.useCallback(( name: string, value: string ): void => {
		setTemplateTexts(current => ({
			...current,
			[name]: value,
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	/** Generate xml code */
	const toTemplateText = React.useCallback((): string => {
		const xml: string = `
		<?xml version="1.0" encoding="utf-8"?>
		<scenario>
			${Object.values(templateTexts).join('')}
		</scenario>`;
		
		return xmlFormatter(xml, {indentation: '  '});
	}, [templateTexts]);
	
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [templateTexts]);
	
	/** Download language file button click handler */
	const downloadLanguageFileClick = React.useCallback((): void => {
		var blob = new Blob([toLanguageTemplateText()], {type: 'text/xml;charset=utf-8'});
		FileSaver.saveAs(blob, `en_${SCENARIO_NAME}.lng.xml`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [langStrings]);
	
	return (
		<>
			<Accordion defaultActiveKey="general">
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2 position-relative">
						<Accordion.Toggle as={Button} variant="link" eventKey="general">
							General
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="general">
						<Card.Body>
							<HardcoreModeAllowed onChange={v => updateText('hardcoreModeAllowed', v)} />
							<NomadModeAllowed onChange={v => updateText('nomadModeAllowed', v)} />
							<MapSize onChange={v => updateText('mapSize', v)} />
							<ShowCompletionIcon onChange={v => updateText('showCompletionIcon', v)} />
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Card.Header className="pt-1 pb-1 pl-2 pl-2 position-relative">
						<Accordion.Toggle as={Button} variant="link" eventKey="locations">
							Locations
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="locations">
						<Card.Body>
							<LocationContainer onChange={( template: string, list: Array<LocationProps> ) => {
								updateText('locations', template)
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
