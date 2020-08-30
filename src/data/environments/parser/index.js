// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

import { recursive } from 'merge';

// Utils
import { jsonToRedux as j2r1 } from './modules/noise-amplitudes';
import { jsonToRedux as j2r2 } from './modules/resource-factor';
import { jsonToRedux as j2r3 } from './modules/distance-height-offset';
import { jsonToRedux as j2r4 } from './modules/ford-distance-factor';
import { jsonToRedux as j2r5 } from './modules/sun-angle-factor';
import { jsonToRedux as j2r6 } from './modules/backdrop-scale';
import { jsonToRedux as j2rdo1 } from './modules/deposit/deposits';
import { jsonToRedux as j2rdo2 } from './modules/deposit/deposit-override-prototypes';
import { jsonToRedux as j2rde1 } from './modules/detail/detail-override-prototypes';
import { jsonToRedux as j2rpr1 } from './modules/prop/prop-override-prototypes';
import { jsonToRedux as j2rtr1 } from './modules/tree/global-tree-density';
import { jsonToRedux as j2rtr2 } from './modules/tree/trees-everywhere';
import { jsonToRedux as j2rtr3 } from './modules/tree/trees';
import { jsonToRedux as j2rtr4 } from './modules/tree/tree-override-prototypes';
import { jsonToRedux as j2rse } from './modules/seasons';

/**
 * @public
 * @static
 * Convert environment json into redux data */
export function jsonToRedux ( json: Object ): Object {
	const environment: Object = recursive(true, {},
		j2r1(json), j2r2(json), j2r3(json),
		j2r4(json), j2r5(json), j2r6(json),
		j2rdo1(json), j2rdo2(json),
		j2rde1(json), j2rpr1(json),
		j2rtr1(json), j2rtr2(json), j2rtr3(json), j2rtr4(json),
		j2rse(json),
	);
	
	return {environment};
}
