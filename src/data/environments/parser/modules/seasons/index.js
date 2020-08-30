/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-30
 */
 
import op from 'object-path';
import { recursive } from 'merge';

// Utils
import { jsonToRedux as j2rs1 } from './modules/spring';
import { jsonToRedux as j2rs3 } from './modules/summer';
import { jsonToRedux as j2rs2 } from './modules/fall';
import { jsonToRedux as j2rs4 } from './modules/winter';

/**
 * @public
 * @static
 * Convert environment json into redux data */
export function jsonToRedux ( json: Object ): Object {
	const parsed: Array<Object> = op.get(json, 'environment.seasons.season', []);

	if ( parsed === null || !Array.isArray(parsed) ) {
		return {};
	}
	
	const seasons: Object = recursive(true, {},
		j2rs1(parsed), j2rs2(parsed),
		j2rs3(parsed), j2rs4(parsed),
	);
	
	return Object.keys(seasons).length !== 4
		? {}
		: {seasons};
}
