/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

/** transformObject() options argument type */
export interface TransformObjectOptions {
  /** Required property */
  requiredProp?: string | null,
  /** Optional properties list */
  optionalProps?: (string | { group: string, key: string })[],
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey?: string,

  /** Required property validator */
  requiredPropValidator?(value: any): boolean,

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any,
}

/** transformOverrideObject() options argument type */
export interface TransformOverrideObjectOptions {
  /** Path to node (e.g., 'abc.def') */
  root?: string,
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey?: string,
  /** transformObject() options */
  transformOptions?: TransformObjectOptions,

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any,
}

/** transformNumeric() options argument type */
export interface TransformNumericOptions {
  /** Path to node (e.g., 'abc.def') */
  root?: string,
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey?: string,

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any,
}

/** transformBoolean() options argument type */
export interface TransformBooleanOptions {
  /** Path to node (e.g., 'abc.def') */
  root?: string,
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey?: string,

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any,
}

/** transformSplitStringArray() options argument type */
export interface TransformSplitStringArrayOptions {
  /** Path to node (e.g., 'abc.def') */
  root: string,
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey: string,
  /** Split char (e.g., ' ') */
  splitChar?: string,
  /** Minimum required items [0 = no limit] */
  minItems?: number,
  /** Maximum limit of items [0 = no limit] */
  maxItems?: number,

  /** Parsed list validator */
  itemsValidator?(value: string): boolean,

  /** Transform each value */
  transformValue?(value: string): any,

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any,
}

/** transformNumericArray() options argument type */
export interface TransformNumericArrayOptions {
  /** Path to node (e.g., 'abc.def') */
  root: string,
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey: string,
  /** Minimum required items [0 = no limit] */
  minItems?: number,
  /** Maximum limit of items [0 = no limit] */
  maxItems?: number,

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any,
}

/** transformString() options argument type */
export interface TransformStringOptions {
  /** Path to node (e.g., 'abc.def') */
  root?: string,
  /** Wrapper object key (e.g., 'overrideDetails') */
  wrapperKey?: string,

  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any,
}
