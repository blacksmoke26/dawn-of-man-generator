/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-07-01
 * @version 2.5.0
 */

// utils
import {toFloat} from '~/helpers/number';

// types
import {ValueFrequencies} from './general';
import {KVDocument} from '~/types/json.types';
import {environment} from '~/data/environments/parser/types';

const toNoiseAmplitudes = (params: string): environment.NoiseAmplitudes => {
  return params.split(' ').map(freq => toFloat(freq, 4)) as unknown as environment.NoiseAmplitudes;
};

export default [{
  caption: 'Bloodline',
  group: 'Schwifty',
  id: 'schwifty_bloodline',
  values: toNoiseAmplitudes('0.03 0.2321 0.01 0.05 0.0035 0.007 0.03 0.05'),
}, {
  caption: 'Flatlands Larger Hills',
  group: 'Schwifty',
  id: 'schwifty_flatlands_larger_hills',
  values: toNoiseAmplitudes('0 0.5'),
}, {
  caption: 'Happy farmer',
  group: 'Schwifty',
  id: 'schwifty_happy_farmer',
  values: toNoiseAmplitudes('0.003 0.2 0.01 0.05 0.075 0.0 0.0 0.05'),
}, {
  caption: 'Highlander',
  group: 'Schwifty',
  id: 'schwifty_highlander',
  values: toNoiseAmplitudes('0.5 0.0 0.0 0.05 0.075 0.0 0.0 0.04'),
}, {
  caption: 'Nemesis in the Stone Age',
  group: 'Schwifty',
  id: 'schwifty_nemesis',
  values: toNoiseAmplitudes('0.0 0.03 0.2 0.154 0.097 0.045 0.025 0.005'),
}, {
  caption: 'Small village',
  group: 'Schwifty',
  id: 'schwifty_small_village',
  values: toNoiseAmplitudes('0.003 0.2 0.01 0.05 0.075 0.01 0.0 0.04'),
}] as { caption: string; id: string; group?: string; values: environment.NoiseAmplitudes }[];
