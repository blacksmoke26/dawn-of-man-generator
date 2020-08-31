// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-31
 */

import xmlParser from 'fast-xml-parser';

// Utils
import { jsonToRedux } from './../parser/index';

/**
 * @private
 * @static
 * Check that array values are equal */
function allEqual ( arr: Array<any> ): boolean {
	return arr.every( v => v === arr[0] );
}

/**
 * @public
 * @static
 * Check the XML is valid or not
 */
export function validateXml ( xml: string ): boolean {
	try {
		const valid = xmlParser.validate(xml);
		return typeof valid === 'boolean';
	} catch ( e ) {
		return false;
	}
}

/**
 * @public
 * @static
 * Convert XML to JSON
 * @throws {Error} - Failed to parse xml
 */
export function xmlToJson ( xml: string ): Object {
	try {
		return xmlParser.parse(xml, {
			attributeNamePrefix : '',
			ignoreAttributes : false,
			parseAttributeValue : true,
			parseNodeValue : true,
			allowBooleanAttributes : true,
		}, true);
	} catch ( e ) {
		throw e;
	}
}

/**
 * @public
 * @static
 * Convert XML to Redux JSON
 * @throws {Error} - Failed to parse xml
 */
export function xmlToReduxJson ( xml: string ): Object {
	const json: Object = xmlToJson(xml);
	
	if ( !json.hasOwnProperty('environment') ) {
		throw new Error('Not a valid environment XML');
	}

	const converted: Object = jsonToRedux(json, {
		nullResolver: ( key: string ) => ({[key]: false}),
	});
	
	if ( allEqual(Object.values(converted?.environment || {})) ) {
		throw new Error('XML text contains no environment data');
	}
	
	return converted;
}
