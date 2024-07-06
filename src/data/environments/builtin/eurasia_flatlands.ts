/**
 * Environment `eurasia_flatlands`
 * This scenario tailored to some challenges too
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
  label: 'Eurasia Flatlands',
  value: 'eurasia_flatlands',
  desc: 'This scenario tailored to some of the challenges too',
};

/** Environment raw data */
const environmentData: environment.Environment = {
  ...resetValues,
  noiseAmplitudes: [0.0, 0.03, 0.2, 0.154, 0.097, 0.045, 0.025, 0.005],
  distanceHeightOffset: 0.02,
  deposits: ['Flint'],
  trees: [
    'Oak', 'Birch', 'Beech', 'Rye', 'Einkorn', 'Emmer',
    'Flax', 'BitterVetch', 'Chickpeas', 'Lentils', 'Peas',
    'Blackberry', 'Blueberry', 'Raspberry', 'Strawberry',
    'Chestnut', 'Pear', 'Cherry', 'Service',
  ],
  seasons: {
    Spring: {
      duration: 0.25,
      precipitationChance: 0.25,
      windyChance: 0.5,
      veryWindyChance: 0.1,
      fishBoost: 0.5,
      temperature: [5, 25],
    },
    Fall: {
      duration: 0.25,
      precipitationChance: 0.25,
      windyChance: 0.5,
      veryWindyChance: 0.1,
      temperature: [5, 25],
    },
    Summer: {
      duration: 0.25,
      precipitationChance: 0,
      windyChance: 0.25,
      temperature: [20, 35],
    },
    Winter: {
      duration: 0.25,
      precipitationChance: 0.5,
      windyChance: 0.5,
      veryWindyChance: 0.5,
      reducedFauna: true,
      temperature: [-15, 10],
    },
  },
};

/** Get environment data */
export default function getData() {
  return {environment: environmentData};
}
