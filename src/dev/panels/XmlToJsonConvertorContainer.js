// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2019-11-10
 */

import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Card, Button, Form } from 'react-bootstrap';
import { anOldHope } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import xmlParser from 'fast-xml-parser';
import copyClipboard from 'clipboard-copy';

// Types
import type { Node } from 'react';

/** ConvertorContainer functional component */
function XmlToJsonConvertorContainer (): Node {
	const [value, setValue] = React.useState<string>('');
	const [xmlText, setXmlText] = React.useState<string>('');
	
	/** Generate xml code */
	const toTemplateText = (): string => {
		let json: Object = {};
		
		if ( !xmlText ) {
			return '{}';
		}
		
		try{
			json = xmlParser.parse(xmlText, {
				attributeNamePrefix : '',
				ignoreAttributes : false,
				parseAttributeValue : true,
				parseNodeValue : true,
				allowBooleanAttributes : true,
			}, true);
		} catch ( e ) {
			return e.message;
		}
		
		return JSON.stringify(json, null, '  ');
	}
	
	return (
		<>
			<Card>
				<Card.Body>
					<Form.Control value={value} onChange={(e) => {
						const val: string = String(e.currentTarget.value).trim();
						setValue(val);
						setTimeout(() => {
							setXmlText(val);
						}, 50);
					}} as="textarea" className="font-family-code" style={{height: 300}} />
				</Card.Body>
			</Card>
			<hr/>
			<div className="syntax-highlighter">
				<SyntaxHighlighter style={anOldHope} language="json">
					{toTemplateText()}
				</SyntaxHighlighter>
			</div>
			<div className="mt-2">
				<Button size="sm" variant="secondary"
					onClick={() => copyClipboard(toTemplateText())}>
					Copy to Clipboard
				</Button>
			</div>
		</>
	);
}

export default XmlToJsonConvertorContainer;
