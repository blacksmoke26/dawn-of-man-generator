/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';
import merge from 'deepmerge';
import {camelCase} from 'change-case';

// helpers
import {isObject} from '~/helpers/object';
import {hasKeysInArray} from '~/helpers/array';

// types
import type {Required} from 'utility-types';
import type {Json, KVDocument} from '~/types/json.types';
import {
  TransformObjectOptions,
  TransformOverrideObjectOptions,
  TransformNumericOptions,
  TransformBooleanOptions,
  TransformSplitStringArrayOptions,
  TransformNumericArrayOptions,
  TransformStringOptions,
  TransformObjectAttributesOptions,
  TransformObjectAttributesOptionsArray,
  NormalizeNodeAttributesOptions,
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
        [id]: {...node},
      },
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
export const transformNumeric = (json: Json, options: TransformNumericOptions): KVDocument<number> => {
  const opt = merge<Required<TransformNumericOptions>>({
    wrapperKey: '',
    validate: () => true,
    transform: value => value,
    nullResolver: () => ({}),
  }, options);

  const parsed = op.get<number | any | null>(json, opt.root, null);

  if ( parsed === null
    || 'number' !== typeof parsed
    || !opt.validate(parsed)) {
    return opt.nullResolver(opt.wrapperKey);
  }

  if (
    (opt?.min !== undefined && parsed < opt.min)
    || (opt?.max !== undefined && parsed > opt.max)
  ) {
    return opt.nullResolver(opt.wrapperKey);
  }

  return {[opt.wrapperKey]: opt.transform(parsed)};
};

/**
 * @public
 * @static
 * Transform boolean node into an object */
export const transformBoolean = (json: Json, options: TransformBooleanOptions): KVDocument<boolean> => {
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
    validate: () => true,
    transform: value => value,
    nullResolver: () => ({}),
  }, options);

  const value = op.get<string | any | null>(json, opt.root, null);

  if ( value === null
    || 'string' !== typeof value
    || !opt.validate(value)) {
    return opt.nullResolver(opt.wrapperKey);
  }

  return {[opt.wrapperKey]: opt.transform(value.trim())};
};

/**
 * @public
 * @static
 * Transform node attributes into object, check {@link transformObjectAttributes} for implementation.
 */
export const normalizeNodeAttributes = (node: Json | null, options: NormalizeNodeAttributesOptions = {}): Json | any => {
  const opt = merge<Required<NormalizeNodeAttributesOptions>>({
    required: [],
    only: [],
    camelKeys: false,
    failed: () => true,
    transform: (name, value) => value,
    filter: () => true,
    filterRequired: () => true,
  }, options);

  if (node === null || !isObject(node)) {
    return opt.failed();
  }

  const requiredCount = opt.required.length;
  const container: Json = {};
  const onlyCount = opt.only.length;

  if (requiredCount && !hasKeysInArray(Object.keys(node), opt.required)) {
    return opt.failed();
  }

  for (const [name, value] of Object.entries(node)) {
    if (!opt.filterRequired(name, value)) {
      return opt.failed();
    }

    if ((onlyCount && !opt.only.includes(name)) || !opt.filter(name, value)) {
      continue;
    }

    const _name = opt.camelKeys ? camelCase(name) : name;
    container[_name] = opt.transform(name, value);
  }

  return container;
};

/**
 * @public
 * @static
 * Transform node attributes into object */
export const transformObjectAttributes = (node: Json, options: TransformObjectAttributesOptions = {}): Json => {
  const opt = merge<Required<TransformObjectAttributesOptions>>({
    wrapperKey: '',
    required: [],
    only: [],
    camelKeys: false,
    transform(name, value) {
      return value;
    },
    filter() {
      return true;
    },
    filterRequired() {
      return true;
    },
    nullResolver: () => ({}),
  }, options);

  if (!isObject(node)) {
    return opt.nullResolver(opt.wrapperKey);
  }

  const objData = op.get<Json | null>(node, opt.root, null);

  const resolvedNode = normalizeNodeAttributes(objData, {
    camelKeys: opt.camelKeys,
    required: opt.required,
    only: opt.only,
    transform: opt.transform,
    filterRequired: opt.filterRequired,
    filter: opt.filter,
    failed: () => null,
  });

  if (resolvedNode === null) {
    return opt.nullResolver(opt.wrapperKey);
  }

  return {[opt.wrapperKey]: resolvedNode};
};

/**
 * @public
 * @static
 * Transform node attributes array into object */
export const transformObjectAttributesArray = (node: Json, options: TransformObjectAttributesOptionsArray): Json => {
  const opt = merge<Required<TransformObjectAttributesOptionsArray>>({
    wrapperKey: '',
    uniqueKey: '',
    minItems: 0,
    maxItems: 0,
    required: [],
    only: [],
    camelKeys: false,
    transform: (name, value) => value,
    filter: () => true,
    filterRequired: () => true,
    nullResolver: () => ({}),
  }, options);

  if (!isObject(node)) {
    return opt.nullResolver(opt.wrapperKey);
  }

  const objData = op.get<Json | Json[] | null>(node, opt.root, null);

  const nodes: Json[] = [];

  //<editor-fold desc="Type resolver">
  if (isObject(objData)) {
    nodes.push(objData as Json);
  } else if (Array.isArray(objData)) {
    nodes.push(...objData);
  } else {
    return opt.nullResolver(opt.wrapperKey);
  }
  //</editor-fold>

  if ((opt.minItems > 0 && nodes.length < opt.minItems)) {
    return opt.nullResolver(opt.wrapperKey);
  }

  if ((opt.maxItems > 0 && nodes.length > opt.maxItems)) {
    nodes.splice(opt.maxItems);
  }

  let collection: Json[] = [];

  for (const node of nodes) {
    const resolvedNode = normalizeNodeAttributes(node, {
      camelKeys: opt.camelKeys,
      required: opt.required,
      only: opt.only,
      transform: opt.transform,
      filterRequired: opt.filterRequired,
      filter: opt.filter,
      failed: () => null,
    });

    if (resolvedNode !== null) {
      collection.push(resolvedNode);
    }
  }

  if (opt.uniqueKey.trim()) {
    collection = collection.filter((value, index, self) => {
      return self.findIndex(v => v[opt.uniqueKey] === value[opt.uniqueKey]) === index;
    });
  }

  return {[opt.wrapperKey]: collection};
};
