/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

/* eslint import/no-webpack-loader-syntax: off */

import generalEurasia from '!!raw-loader!./general/eurasia.xml';
import generalEurasiaConflict from '!!raw-loader!./general/eurasia-conflict.xml';
import generalEurasiaFlatlands from '!!raw-loader!./general/eurasia-flatlands.xml';
import generalEurasiaGlacial from '!!raw-loader!./general/eurasia-glacial.xml';
import generalEurasiaNorth from '!!raw-loader!./general/eurasia-north.xml';
import generalEurasiaWarm from '!!raw-loader!./general/eurasia-warm.xml';
import generalFlat from '!!raw-loader!./general/flat.xml';

// parsers
import {xmlToReduxJson} from '~/data/environments/loader';

// types
import {Options} from '~/components/ui/Select';

export const presets = {
  // General
  'general/eurasia': generalEurasia,
  'general/eurasia_conflict': generalEurasiaConflict,
  'general/eurasia_flatlands': generalEurasiaFlatlands,
  'general/eurasia_glacial': generalEurasiaGlacial,
  'general/eurasia_north': generalEurasiaNorth,
  'general/eurasia_warm': generalEurasiaWarm,
  'general/flat': generalFlat,
};

export type EnvironmentName = keyof typeof presets;

export const presetsName = Object.keys(presets) as EnvironmentName[];

/** Environment presets */
export const presetOptions: Options = [{
  label: 'General',
  options: [{
    label: 'Eurasia',
    value: 'general/eurasia',
    description: 'Standard environment, used in the Continental Dawn freeplay scenario.',
    type: 'environment',
  }, {
    label: 'Eurasia conflict',
    value: 'general/eurasia_conflict',
    description: 'Like eurasia but with less resources, used in the Ancient Warriors freeplay scenario.',
    type: 'environment',
  }, {
    label: 'Eurasia flatlands',
    value: 'general/eurasia_flatlands',
    description: 'This scenario tailored to some of the challenges too',
    type: 'environment',
  }, {
    label: 'Eurasia glacial',
    value: 'general/eurasia_glacial',
    description: 'This scenario tailored to some of the challenges too',
    type: 'environment',
  }, {
    label: 'Eurasia north',
    value: 'general/eurasia_north',
    description: 'Longer winters, few resources, only perennial trees, used in the The Northlands freeplay scenario',
    type: 'environment',
  }, {
    label: 'Eurasia warm',
    value: 'general/eurasia_warm',
    description: 'More resources, shorter winters. Used in Creative Mode.',
    type: 'environment',
  }, {
    label: 'Flat',
    value: 'general/flat',
    description: 'Flat land with specific resources',
    type: 'environment',
  }],
}];

export const presetsXmlToJson = (name: EnvironmentName) => {
  return xmlToReduxJson(presets[name]);
};
