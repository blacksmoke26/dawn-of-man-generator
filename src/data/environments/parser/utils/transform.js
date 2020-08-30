// @flow

import op from 'object-path';

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

/**
 * @public
 * @static
 * Check that given value is object
 */
export function isObject ( obj: any ): boolean {
	return typeof obj === 'object' && !Array.isArray(obj);
}

/** transformObject() options argument type */
type TransformObjectOptions = {
	/** Required property */
	requiredProp: string,
	/** Required property validator */
	requiredPropValidator?: ( value: any ) => boolean,
	/** Optional properties list */
	optionalProps: Array<string>|Array<{group: string, key: string}>,
}

/**
 * @public
 * @static
 * Transform given node into object */
export function transformObject ( node: any, options: TransformObjectOptions = {} ): Object {
	if ( !isObject(node) ) {
		return {};
	}
	
	const opt: TransformObjectOptions = {
		requiredProp: null,
		requiredPropValidator: () => true,
		optionalProps: [],
		...options,
	};
	
	const id: string = op.get(node, `${opt.requiredProp}.value`, null);
	
	if ( id === null || !opt.requiredPropValidator(id) ) {
		return {};
	}
	
	const container: Object = {};
	
	container.id = id;
	
	for ( let optPrp of opt.optionalProps ) {
		if ( typeof optPrp === 'string' ) {
			const value: any = op.get(node, `${optPrp}.value`, null);
			value !== null && (container[optPrp] = value);
			continue;
		}
		
		if ( isObject(optPrp) ) {
			const {group, key} = optPrp;
			const value: number = op.get(node, `${key}.value`, null);
			
			if ( value === null ) {
				continue;
			}
			
			if ( !container.hasOwnProperty(group) ) {
				container[group] = [value];
			} else {
				container[group].push(value);
			}
		}
	}
	
	return container;
}

/** transformOverrideObject() options argument type */
type TransformOverrideObjectOptions = {
	/** Path to node (e.g., 'abc.def') */
	root: string,
	/** Wrapper object key (e.g., 'overrideDetails') */
	wrapperKey: string,
	/** transformObject() options */
	transformOptions: TransformOptions,
}

/**
 * @public
 * @static
 * Transform prototypes override nodes into object */
export function transformOverrideObject ( json: any, options: TransformOverrideObjectOptions ): Object {
	const parsed: ?Array<Object> = op.get(json, options.root, null);
	
	if ( parsed === null ) {
		return {};
	}
	
	if ( isObject(parsed) ) {
		const node = transformObject(parsed, options.transformOptions);
		
		if ( !node.hasOwnProperty('id') ) {
			return {};
		}
		
		const id: string = String(node.id)
		delete node.id;
		
		return {[options.wrapperKey]: {
			[id]: {...node}
		}};
	}
	
	if ( Array.isArray(parsed) && parsed.length ) {
		const dataNodes: Object = {};
		
		for ( let p of parsed ) {
			const node: Object = transformObject(p, options.transformOptions);
			
			if ( !node.hasOwnProperty('id') ) {
				continue;
			}
			
			const id: string = String(node.id)
			delete node.id;
			
			dataNodes[id] = {...node};
		}
		
		return {[options.wrapperKey]: dataNodes};
	}
	
	return {};
}

/** transformNumeric() options argument type */
type TransformNumericOptions = {
	/** Path to node (e.g., 'abc.def') */
	root: string,
	/** Wrapper object key (e.g., 'overrideDetails') */
	wrapperKey: string,
}

/**
 * @public
 * @static
 * Transform numeric node into object */
export function transformNumeric ( json: any, options: TransformNumericOptions ): Object {
	const parsed: ?Array<Object> = op.get(json, options.root, null);
	
	return parsed === null ? {} : {
		[options.wrapperKey]: parsed,
	};
}

/** transformBoolean() options argument type */
type TransformBooleanOptions = {
	/** Path to node (e.g., 'abc.def') */
	root: string,
	/** Wrapper object key (e.g., 'overrideDetails') */
	wrapperKey: string,
}

/**
 * @public
 * @static
 * Transform boolean node into object */
export function transformBoolean ( json: any, options: TransformBooleanOptions ): Object {
	const parsed: ?Array<Object> = op.get(json, options.root, null);
	
	return parsed === null || typeof parsed !== 'boolean' ? {} : {
		[options.wrapperKey]: parsed,
	};
}

/** transformSplitStringArray() options argument type */
type TransformSplitStringArrayOptions = {
	/** Path to node (e.g., 'abc.def') */
	root: string,
	/** Wrapper object key (e.g., 'overrideDetails') */
	wrapperKey: string,
	/** Split char (e.g., ' ') */
	splitChar?: string,
	/** Parsed list validator */
	itemsValidator?: ( value: string ) => boolean,
	/** Transform each value */
	transformValue?: ( value: string ) => any,
	/** Minimum required items [0 = no limit] */
	minItems?: number,
	/** Maximum limit of items [0 = no limit] */
	maxItems?: number,
}

/**
 * @public
 * @static
 * Transform string based array node into object */
export function transformSplitStringArray ( json: any, options: TransformSplitStringArrayOptions ): Object {
	const opt: TransformSplitStringArrayOptions = {
		splitChar: ' ',
		itemsValidator: () => true,
		transformValue: ( value: string ) => value,
		minItems: 0,
		maxItems: 0,
		...options,
	};
	
	const parsed: any = op.get(json, options.root, null);
	
	if ( parsed === null || !String(parsed || '') ) {
		return {};
	}
	
	const list: Array<string> = String(parsed)
		.split(opt.splitChar)
		.map(d => String(d || '').trim())
		.map(opt.transformValue)
		.filter(opt.itemsValidator);
	
	if ( opt.minItems > 0 && list.length < opt.minItems ) {
		return {};
	}
	
	if ( opt.maxItems > 0 && list.length > opt.maxItems ) {
		return {};
	}
	
	return !list.length ? {} : {
		[opt.wrapperKey]: list,
	};
}

/** transformNumericArray() options argument type */
type TransformNumericArrayOptions = {
	/** Path to node (e.g., 'abc.def') */
	root: string,
	/** Wrapper object key (e.g., 'overrideDetails') */
	wrapperKey: string,
	/** Minimum required items [0 = no limit] */
	minItems?: number,
	/** Maximum limit of items [0 = no limit] */
	maxItems?: number,
}

/**
 * @public
 * @static
 * Transform string based numeric array node into object */
export function transformNumericArray ( json: any, options: TransformNumericArrayOptions ): Object {
	const opt: TransformNumericArrayOptions = {
		minItems: 0,
		maxItems: 0,
		...options,
	};
	
	const parsed: any = op.get(json, options.root, null);
	
	if ( parsed === null || !Array.isArray(parsed) ) {
		return {};
	}
	
	const list: Array<number> = parsed.map(v => v.value);
	
	if ( opt.minItems > 0 && list.length < opt.minItems ) {
		return {};
	}
	
	if ( opt.maxItems > 0 && list.length > opt.maxItems ) {
		return {};
	}
	
	return !list.length ? {} : {
		[opt.wrapperKey]: list,
	};
}
