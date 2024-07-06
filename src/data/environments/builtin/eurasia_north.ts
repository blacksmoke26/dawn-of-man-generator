/**
 * Environment `eurasia_north`
 * Longer winters, few resources, only perennial trees, used in the The Northlands freeplay scenario
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
  label: 'Eurasia North',
  value: 'eurasia_north',
  desc: 'Longer winters, few resources, only perennial trees, used in the The Northlands freeplay scenario',
};

/** Environment raw data */
const environmentData: environment.Environment = {
  ...resetValues,
  resourceFactor: 0.6,
  fordDistanceFactor: 1.5,
  sunAngleFactor: 0.8,
  trees: [
    'Fir', 'Pine', 'Spruce', 'Rye', 'Einkorn', 'Emmer',
    'Flax', 'BitterVetch', 'Chickpeas', 'Lentils', 'Peas',
    'Blackberry', 'Blueberry', 'Raspberry', 'Strawberry',
    'Chestnut', 'Pear', 'Cherry', 'Service',
  ],
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
      precipitationChance: 0.4,
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
