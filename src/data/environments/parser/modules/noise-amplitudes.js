// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

import op from 'object-path';

/** Convert environment json into redux data */
export function jsonToRedux ( json: Object ): Object {
	const parsed: any = op.get(json, 'environment.noise_amplitudes.values', null);
	
	if ( parsed === null ) {
		return {};
	}
	
	const noiseAmplitudes: Array<number> = typeof parsed === 'number'
		? new Array<number>(7).fill(parsed, 0, 7)
		: parsed.split(' ').map(v => Number(v));
	
	return {noiseAmplitudes};
}
