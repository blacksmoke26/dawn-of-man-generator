/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import op from 'object-path';
import merge from 'deepmerge';

// types
import type {Required} from 'utility-types';
import type {Json} from '~/types/json.types';
import type {JsonToReduxOptions} from '~/utils/parser/index.types';

/** Convert environment json into redux data */
export const jsonToRedux = (json: Json, options: JsonToReduxOptions = {}): Json => {
  const opt = merge<Required<JsonToReduxOptions>>({nullResolver: () => ({})}, options);

  const parsed = op.get<string | number | null>(json, 'environment.noise_amplitudes.values', null);

  if (parsed === null) {
    return opt?.nullResolver('noiseAmplitudes');
  }

  const noiseAmplitudes: Array<number> = typeof parsed === 'number'
    ? new Array<number>(8).fill(parsed, 0, 8)
    : parsed.split(' ').map(v => Number(v));

  return {noiseAmplitudes};
};
