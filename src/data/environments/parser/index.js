// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-29
 */

import { recursive } from 'merge';

// Types
import type { JsonToReduxOptions } from './types/index.flow';

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
export function jsonToRedux ( json: Object, options: JsonToReduxOptions = {} ): Object {
	const environment: Object = recursive(true, {},
		j2r1(json, options), j2r2(json, options), j2r3(json, options),
		j2r4(json, options), j2r5(json, options), j2r6(json, options),
		j2rdo1(json, options), j2rdo2(json, options),
		j2rde1(json, options), j2rpr1(json, options),
		j2rtr1(json, options), j2rtr2(json, options), j2rtr3(json, options), j2rtr4(json, options),
		j2rse(json, options),
	);
	
	return {environment};
}
