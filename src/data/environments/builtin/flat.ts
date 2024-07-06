/**
 * Environment `flat`
 * Flat land with specific resources
 * @link http://madrugaworks.com/dawnofman/files/BuiltinEnvironments.zip
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

// utils
import {resetValues} from '../parser/defaults';

// types
import {environment} from '~/data/environments/parser/types';

/** Environment info */
export const info = {
  label: 'Flat',
  value: 'flat',
  desc: 'Flat land with specific resources',
};

/** Environment raw data */
const environmentData: environment.Environment = {
  ...resetValues,
  noiseAmplitudes: [0],
  treesEverywhere: true,
  trees: ['Oak'],
  seasons: {
    Spring: {
      duration: 0.25,
      precipitationChance: 0.25,
      windyChance: 0.5,
      veryWindyChance: 0.1,
      fishBoost: 0.5,
      temperature: [5, 25],
    },
    Summer: {
      duration: 0.25,
      precipitationChance: 0,
      windyChance: 0.25,
      temperature: [20, 35],
    },
    Fall: {
      duration: 0.25,
      precipitationChance: 0.25,
      windyChance: 0.5,
      veryWindyChance: 0.1,
      temperature: [5, 25],
    },
    Winter: {
      duration: 0.25,
      precipitationChance: 0.25,
      windyChance: 0.5,
      veryWindyChance: 0.1,
      reducedFauna: true,
      temperature: [-15, 10],
    },
  },
};

/** Get environment data */
export default function getData() {
  return {environment: environmentData};
}
