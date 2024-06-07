/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// types
import type {Json} from '~/types/json.types';

import {XMLValidator, XMLParser, validationOptions, X2jOptions, ValidationError} from 'fast-xml-parser';
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

