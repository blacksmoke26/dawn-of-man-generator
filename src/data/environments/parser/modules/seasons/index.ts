/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';
import merge from 'deepmerge';

// helpers
import { mergeAll } from '~/helpers/object';

// types
import type {Required} from 'utility-types';
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from './../../index.types';
import type {TransformOverrideObjectOptions} from '../../utils/transform.types';

// utils
import { jsonToRedux as j2rs1 } from './modules/spring';
import { jsonToRedux as j2rs3 } from './modules/summer';
import { jsonToRedux as j2rs2 } from './modules/fall';
import { jsonToRedux as j2rs4 } from './modules/winter';

/**
 * @public
 * @static
 * Convert environment json into redux data */
export const jsonToRedux = ( json: Json, options: JsonToReduxOptions = {} ): Json => {
	const opt = merge<Required<TransformOverrideObjectOptions>>({
		nullResolver: () => ({}),
	}, options);

	const parsed: Json[] = op.get(json, 'environment.seasons.season', []);

	if ( parsed === null || !Array.isArray(parsed) ) {
		return opt.nullResolver('seasons');
	}

	const seasons = mergeAll(
		j2rs1(parsed), j2rs2(parsed),
		j2rs3(parsed), j2rs4(parsed),
	) as Json;

	return Object.keys(seasons).length !== 4
		? opt.nullResolver('seasons')
		: {seasons};
};
