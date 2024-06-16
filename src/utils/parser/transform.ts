/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';
import merge from 'deepmerge';

// helpers
import {isObject} from '~/helpers/object';

// types
import type {Required} from 'utility-types';
import type {Json} from '~/types/json.types';
import {
  TransformObjectOptions,
  TransformOverrideObjectOptions,
  TransformNumericOptions,
  TransformBooleanOptions,
  TransformSplitStringArrayOptions,
  TransformNumericArrayOptions,
  TransformStringOptions,
} from './transform.types';

/**
 * @public
 * @static
 * Transform given node into object */
export const transformObject = (node: Json, options: TransformObjectOptions = {}): { [p: string]: string[] } => {
  const opt = merge<Required<TransformObjectOptions>>({
    wrapperKey: '',
    requiredProp: null,
    requiredPropValidator: () => true,
    optionalProps: [],
    nullResolver: () => ({}),
  }, options);

  if (!isObject(node)) {
    return opt.nullResolver(opt.wrapperKey);
  }

  const id = op.get<string | null>(node, `${opt.requiredProp}.value`, null);

  if (id === null || !opt.requiredPropValidator(id)) {
    return opt.nullResolver(opt.wrapperKey);
  }

  const container: Record<string, any> = {};

  container.id = id;

  for (let optPrp of opt.optionalProps) {
    if (typeof optPrp === 'string') {
      const value: any = op.get(node, `${optPrp}.value`, null);
      value !== null && (container[optPrp] = value);
      continue;
    }

    if (isObject(optPrp)) {
      const {group, key} = optPrp;
      const value = op.get<number | null>(node, `${key}.value`, null);

      if (value === null) {
        continue;
      }

      if (!(group in container)) {
        container[group] = [value];
      } else {
        container[group].push(value);
      }
    }
  }

  return container;
};

/**
 * @public
 * @static
 * Transform prototypes override nodes into an object */
export const transformOverrideObject = (json: Json, options: TransformOverrideObjectOptions): Json => {
  const opt = merge<Required<TransformOverrideObjectOptions>>({
    nullResolver: () => ({}),
    transformOptions: {},
  }, options);

  const parsed = op.get<Record<string, any> | null>(json, opt.root, null);

  if (parsed === null) {
    return opt.nullResolver(opt.wrapperKey);
  }
  if (isObject(parsed)) {
    const node = transformObject(parsed, opt.transformOptions);

    if (!node.hasOwnProperty('id')) {
      return opt.nullResolver(opt.wrapperKey);
    }

    const id: string = String(node.id);
    delete node.id;

    return {
      [opt.wrapperKey]: {
        [id]: {...node}
      }
    };
  }

  if (Array.isArray(parsed) && parsed.length) {
    const dataNodes: Record<string, any> = {};

    for (let p of parsed) {
      const node = transformObject(p, opt.transformOptions) as Record<string, any>;

      if (!node.hasOwnProperty('id')) {
        continue;
      }

      const id: string = String(node.id);
      delete node.id;

      dataNodes[id] = {...node};
    }

    return {[opt.wrapperKey]: dataNodes};
  }

  return {};
};

/**
 * @public
 * @static
 * Transform numeric node into object */
export const transformNumeric = (json: Json, options: TransformNumericOptions): Json => {
  const opt = merge<Required<TransformNumericOptions>>({
    wrapperKey: '',
    nullResolver: () => ({}),
  }, options);

  const parsed = op.get<Record<string, Json[]> | null>(json, opt.root, null);

  return parsed === null
    ? opt.nullResolver(opt.wrapperKey)
    : {[opt.wrapperKey]: parsed};
};

/**
 * @public
 * @static
 * Transform boolean node into an object */
export const transformBoolean = (json: Json, options: TransformBooleanOptions): Json => {
  const opt = merge<Required<TransformNumericOptions>>({
    wrapperKey: '',
    nullResolver: () => ({}),
  }, options);

  const parsed = op.get<boolean | Json[] | null>(json, opt.root, null);

  return parsed === null || typeof parsed !== 'boolean'
    ? opt.nullResolver(opt.wrapperKey)
    : {[opt.wrapperKey]: parsed};
};

/**
 * @public
 * @static
 * Transform string-based array node into an object */
export const transformSplitStringArray = (json: Json, options: TransformSplitStringArrayOptions): Json => {
  const opt = merge<Required<TransformSplitStringArrayOptions>>({
    splitChar: ' ',
    itemsValidator: () => true,
    transformValue: (value: string) => value,
    minItems: 0,
    maxItems: 0,
    nullResolver: () => ({}),
  }, options);

  const parsed: any = op.get(json, options.root, null);

  if (parsed === null || !String(parsed || '')) {
    return opt.nullResolver(opt.wrapperKey);
  }

  const list: string[] = String(parsed)
    .split(opt.splitChar)
    .map(d => String(d || '').trim())
    .map(opt.transformValue)
    .filter(opt.itemsValidator);

  if (opt.minItems > 0 && list.length < opt.minItems) {
    return opt.nullResolver(opt.wrapperKey);
  }

  if (opt.maxItems > 0 && list.length > opt.maxItems) {
    return opt.nullResolver(opt.wrapperKey);
  }

  return !list.length ? {} : {
    [opt.wrapperKey]: list,
  };
};

/**
 * @public
 * @static
 * Transform string-based numeric array node into an object */
export const transformNumericArray = (json: Json, options: TransformNumericArrayOptions): Json => {
  const opt = merge<Required<TransformNumericArrayOptions>>({
    nullResolver: () => ({}),
    minItems: 0,
    maxItems: 0,
  }, options);

  const parsed: any = op.get(json, opt.root, null);

  if (parsed === null || !Array.isArray(parsed)) {
    return opt.nullResolver(opt.wrapperKey);
  }

  const list: number[] = parsed.map(v => v.value);

  if (opt.minItems > 0 && list.length < opt.minItems) {
    return opt.nullResolver(opt.wrapperKey);
  }

  if (opt.maxItems > 0 && list.length > opt.maxItems) {
    return opt.nullResolver(opt.wrapperKey);
  }

  return !list.length ? {} : {
    [opt.wrapperKey]: list,
  };
};

/**
 * @public
 * @static
 * Transform string node into an object */
export const transformString = (json: Json, options: TransformStringOptions): Json => {
  const opt = merge<Required<TransformStringOptions>>({
    wrapperKey: '',
    nullResolver: () => ({}),
  }, options);

  const parsed = op.get<string | Json[] | null>(json, opt.root, null);
  const isString: boolean = typeof parsed === 'string';

  return parsed === null || !isString
    ? opt.nullResolver(opt.wrapperKey)
    : {[opt.wrapperKey]: isString ? String(parsed || '').trim() : parsed};
};
