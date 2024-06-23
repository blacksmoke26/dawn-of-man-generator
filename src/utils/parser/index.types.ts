/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import type {Json} from '~/types/json.types';

/** `jsonToRedux` options argument type */
export interface JsonToReduxOptions {
  /** Null or none-exist value transformer (Defaults to {}) */
  nullResolver?(wrapperKey: string): any,
}

export type ParserCallback = (json: Json, options?: JsonToReduxOptions) => Json;
