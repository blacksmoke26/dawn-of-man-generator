/**
 * Environment `eurasia_glacial`
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
  label: 'Eurasia Glacial',
  value: 'eurasia_glacial',
  desc: 'This scenario tailored to some of the challenges too',
};

/** Environment raw data */
const environmentData: environment.Environment = {
  ...resetValues,
  resourceFactor: 0.6,
  sunAngleFactor: 0.8,
  trees: [
    'Fir', 'Pine', 'Spruce', 'Blackberry', 'Blueberry',
    'Raspberry', 'Strawberry', 'Chestnut', 'Pear',
    'Cherry', 'Service',
  ],
  deposits: [],
  treeOverridePrototypes: {
    Fir: {
      altitude: [0, 14],
    },
    Spruce: {
      altitude: [0, 14],
    },
    Pine: {
      altitude: [2, 16],
    },
  },
  seasons: {
    Spring: {
      duration: 0.2,
      precipitationChance: 0.25,
      windyChance: 0.5,
      veryWindyChance: 0.1,
      fishBoost: 0.25,
      temperature: [5, 25],
    },
    Summer: {
      duration: 0.2,
      precipitationChance: 0,
      windyChance: 0.25,
      temperature: [20, 35],
    },
    Fall: {
      duration: 0.2,
      precipitationChance: 0.25,
      windyChance: 0.5,
      veryWindyChance: 0.1,
      temperature: [5, 25],
    },
    Winter: {
      duration: 0.4,
      precipitationChance: 1,
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
