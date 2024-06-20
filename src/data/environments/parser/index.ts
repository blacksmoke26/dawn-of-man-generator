/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import merge from 'deepmerge';

// types
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions, ParserCallback} from '~/utils/parser/index.types';

// utils
import {jsonToRedux as j2r1} from './modules/noise-amplitudes';
import {jsonToRedux as j2r2} from './modules/resource-factor';
import {jsonToRedux as j2r3} from './modules/distance-height-offset';
import {jsonToRedux as j2r4} from './modules/ford-distance-factor';
import {jsonToRedux as j2r5} from './modules/sun-angle-factor';
import {jsonToRedux as j2r6} from './modules/backdrop-scale';
import {jsonToRedux as j2rdo1} from './modules/deposit/deposits';
import {jsonToRedux as j2rdo2} from './modules/deposit/deposit-override-prototypes';
import {jsonToRedux as j2rde1} from './modules/detail/detail-override-prototypes';
import {jsonToRedux as j2rpr1} from './modules/prop/prop-override-prototypes';
import {jsonToRedux as j2rtr1} from './modules/tree/global-tree-density';
import {jsonToRedux as j2rtr2} from './modules/tree/trees-everywhere';
import {jsonToRedux as j2rtr3} from './modules/tree/trees';
import {jsonToRedux as j2rtr4} from './modules/tree/tree-override-prototypes';
import {jsonToRedux as j2rse} from './modules/seasons';

/**
 * @public
 * @static
 * Convert environment json into redux data */
export function jsonToRedux(json: Json, options: JsonToReduxOptions = {}): Json {
  const parsers: ParserCallback[] = [
    j2r1, j2r2, j2r3, j2r4, j2r5,
    j2r6, j2rdo1, j2rdo2, j2rde1, j2rpr1,
    j2rtr1, j2rtr2, j2rtr3, j2rtr4, j2rse,
  ];

  const outputs: Json[] = [];

  for (const parserFunc of parsers) {
    outputs.push(parserFunc(json, options));
  }

  return {
    environment: merge.all<Json>(outputs),
  };
}
