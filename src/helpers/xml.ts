/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import merge from 'deepmerge';
import xmlFormatter, {XMLFormatterOptions} from 'xml-formatter';
import {XMLValidator, XMLParser, validationOptions, X2jOptions, ValidationError} from 'fast-xml-parser';

// types
import type {Json} from '~/types/json.types';

export type {ValidationError};

/**
 * Validates that given xml string is a valid XML string
 * @param xml - String to parse
 * @param [options] - Additional validation options
 * @return boolean - True if the string is a valid XML string
 */
export const validate = (xml: string, options: Partial<validationOptions> = {}): boolean | ValidationError => {
  return XMLValidator.validate(xml, options);
};

/**
 * Parse an XML string into a valid JSON object
 * @param xml - String to parse
 * @param [options] - Additional options to pass to the parser
 * @return Parsed JSON object
 */
export const parse = (xml: string, options: Partial<X2jOptions> = {}): Json => {
  return (new XMLParser(options)).parse(xml, {});
};

/**
 * @public
 * @static
 * Convert XML to JSON
 * @throws {Error} - Failed to parse xml
 */
export const xmlToJson = (xml: string, options: Partial<X2jOptions> = {}): Json => {
  try {
    return parse(xml, merge({
      attributeNamePrefix: '',
      ignoreAttributes: false,
      parseAttributeValue: true,
      parseTagValue: true,
      trimValues: true,
      allowBooleanAttributes: true,
    }, options));
  } catch (e) {
    throw e;
  }
};

/**
 * Format the given xml string
 * @param str - The string to format
 * @param options - Additional formatting options
 * @returns - The formatted string
 */
export const formatXml = (str: string, options: XMLFormatterOptions = {}): string => {
  return xmlFormatter(str, {indentation: '  ', ...options});
};
