/**
 * Environment `eurasia_conflict`
 * Like eurasia but with fewer resources, used in the Ancient Warriors freeplay scenario.
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
  label: 'Eurasia Conflict',
  value: 'eurasia_conflict',
  desc: 'Like eurasia but with less resources, used in the Ancient Warriors freeplay scenario.',
};

/** Environment raw data */
const environmentData: environment.Environment = {
  ...resetValues,
  resourceFactor: 0.75,
  fordDistanceFactor: 1.5,
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
