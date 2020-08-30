// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

import op from 'object-path';

// Types
import type { JsonToReduxOptions } from './../types/index.flow';

/** Convert environment json into redux data */
export function jsonToRedux ( json: Object, options: JsonToReduxOptions = {} ): Object {
	const opt: TransformOverrideObjectOptions = {
		nullResolver: () => ({}),
		...options,
	};
	
	const parsed: any = op.get(json, 'environment.noise_amplitudes.values', null);
	
	if ( parsed === null ) {
		return opt.nullResolver('noiseAmplitudes');
	}
	
	const noiseAmplitudes: Array<number> = typeof parsed === 'number'
		? new Array<number>(8).fill(parsed, 0, 8)
		: parsed.split(' ').map(v => Number(v));
	
	return {noiseAmplitudes};
}
