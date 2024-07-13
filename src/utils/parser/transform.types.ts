/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import {KVDocument} from '~/types/json.types';

/** transformObject() options argument type */
export interface TransformObjectOptions {
  /** Required property */
  requiredProp?: string | null;
  /** Optional properties list */
  optionalProps?: (string | { group: string, key: string })[];
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey?: string;

  /** Required property validator */
  requiredPropValidator?(value: any): boolean;

  /** Transform whole object */
  transformOutput?(list: KVDocument): KVDocument;

  /** Transform each object property value, return null to skip */
  transformPropertyValue?(key: string, value: any): any;

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any;
}

/** transformOverrideObject() options argument type */
export interface TransformOverrideObjectOptions {
  /** Path to node (e.g., 'abc.def') */
  root?: string;
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey?: string;
  /** transformObject() options */
  transformOptions?: TransformObjectOptions;

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any;
}

/** transformNumeric() options argument type */
export interface TransformNumericOptions {
  /** Path to node (e.g., 'abc.def') */
  root: string,
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey: string,
  /** Minimum allowed value (will ignore if lesser) */
  min?: number;
  /** Maximum allowed value (will ignore if greater) */
  max?: number;

  /**
   * Convert/Cast or transform the value
   * @param value The value
   * @returns Transformed value
   */
  transform?(value: number): number;

  /**
   * Validate the value
   * @param value The value
   * @returns True if valid, false otherwise
   */
  validate?(value: number): boolean;

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any;
}

/** transformBoolean() options argument type */
export interface TransformBooleanOptions {
  /** Path to node (e.g., 'abc.def') */
  root?: string;
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey?: string;

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any;
}

type NullResolverReturn = (wrapperKey: string) => any
type EmptyResolver = object;

/** transformSplitStringArray() options argument type */
export interface TransformSplitStringArrayOptions {
  /** Path to node (e.g., 'abc.def') */
  root: string;
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey: string;
  /** Split char (e.g., ' ') */
  splitChar?: string;
  /** Minimum required items [0 = no limit] */
  minItems?: number;
  /** Maximum limit of items [0 = no limit] */
  maxItems?: number;
  /** Setting true will remove duplicate values from array */
  unique?: boolean;

  /** Transform whole array */
  transformOutput?(list: string[]): string[];

  /** Parsed list validator */
  itemsValidator?(value: string): boolean;

  /** Transform each value */
  transformValue?(value: string): any;

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any;

  /**
   * Empty value `''` resolver (Defaults to `nullResolver`)
   *
   * @example
   * emptyResolver(nullResolver, nodePresent, wrapperKey): any {
   *   return nodePresent ? {[wrapperKey]: []} : nullResolver;
   * },
   * */
  emptyResolver?(nullResolver: NullResolverReturn, nodePresent: boolean, wrapperKey: string): NullResolverReturn;

  /**
   * Empty list resolver (Defaults to `{}`)<br>
   * Note: Passing `{}` will simply ignore the node.
   *
   * @example Ignore the node (default behavior)
   * emptyListResolver (emptyResolver): any {
   *   return emptyResolver;
   * }
   *
   * @example Returns empty list
   * emptyListResolver (emptyResolver, wrapperKey): any {
   *   return {[wrapperKey]: []};
   * }
   */
  emptyListResolver?(emptyResolver: EmptyResolver, wrapperKey: string): EmptyResolver;
}

/** transformNumericArray() options argument type */
export interface TransformNumericArrayOptions {
  /** Path to node (e.g., 'abc.def') */
  root: string;
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey: string;
  /** Minimum required items [0 = no limit] */
  minItems?: number;
  /** Maximum limit of items [0 = no limit] */
  maxItems?: number;

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any,
}

/** transformString() options argument type */
export interface TransformStringOptions {
  /** Path to node (e.g., 'abc.def') */
  root?: string;
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey?: string;

  /**
   * Convert/Cast or transform the value
   * @param value The value
   * @returns Transformed value
   */
  transform?(value: string): string;

  /**
   * Validate the value
   * @param value The value
   * @returns True if valid, false otherwise
   */
  validate?(value: string): boolean;

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any;
}

/** transformObjectAttributes() options argument type */
export interface TransformObjectAttributesOptions {
  /** Path to node (e.g., 'abc.def') */
  root?: string,
  /** Wrapper object key (e.g., 'overrideDetails) */
  wrapperKey?: string;
  /** List of required attributes name */
  required?: string[];
  /** List of supported attributes name, empty to pick all */
  only?: string[];
  /** Transform keys case into camel-case  */
  camelKeys?: boolean;

  /** Required attribute validator, Failing means node is invalid
   * @param name Attribute name
   * @param value Attribute value
   * @returns True if attribute is valid, false otherwise
   */
  filterRequired?(name: string, value: any): boolean | undefined;

  /** Optional attribute validator
   * @param name Attribute name
   * @param value Attribute value
   * @returns True if attribute is valid, false otherwise
   */
  filter?(name: string, value: any): boolean;

  /** Transform attribute value
   * @param name Attribute name
   * @param value Attribute value
   * @returns Transformed attribute value
   */
  transform?(name: string, value: any): any;

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any;
}

/** transformObjectAttributesArray() options argument type */
export interface NormalizeNodeAttributesOptions {
  /** List of required attributes name */
  required?: string[];
  /** List of supported attributes name, empty to pick all */
  only?: string[];
  /** Transform keys case into camel-case  */
  camelKeys?: boolean;

  /** Required attribute validator, Failing means node is invalid
   * @param name Attribute name
   * @param value Attribute value
   * @returns True if attribute is valid, false otherwise / undefined to exclude property
   */
  filterRequired?(name: string, value: any): boolean | undefined;

  /** A callback executes when the parsing/validation is failed
   * @returns The value to be returned
   */
  failed?(): any;

  /** Optional attribute validator
   * @param name Attribute name
   * @param value Attribute value
   * @returns True if attribute is valid, false otherwise
   */
  filter?(name: string, value: any): boolean | undefined;

  /** Transform attribute value
   * @param name Attribute name
   * @param value Attribute value
   * @returns Transformed attribute value / undefined to exclude property
   */
  transform?(name: string, value: any): any;
}


/** transformObjectAttributesArray() options argument type */
export interface TransformObjectAttributesOptionsArray extends TransformObjectAttributesOptions {
  /** Path to node (e.g., 'tag.nodes') */
  root: string;
  /** Wrapper object key (e.g., 'overrideDetails) */
  wrapperKey: string;

  /** Minimum required items [0 = no limit] */
  minItems?: number;
  /** Maximum limit of items [0 = no limit] */
  maxItems?: number;
  /** Filter nodes based on a unique attribute value */
  uniqueKey?: string;
}
