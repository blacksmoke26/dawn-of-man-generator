/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

/* eslint import/no-webpack-loader-syntax: off */

import freeplayAncientWarriors from '!!raw-loader!./freeplay/ancient-warriors.xml';
import freeplayContinentalDawn from '!!raw-loader!./freeplay/continental-dawn.xml';
import freeplayTheNorthlands from '!!raw-loader!./freeplay/the-northlands.xml';

import challengesBygoneTalesBeforeDawn from '!!raw-loader!./challenges/bygone-tales/before-dawn.xml';
import challengesBygoneTalesTempleOfTheSun from '!!raw-loader!./challenges/bygone-tales/temple-of-the-sun.xml';
import challengesBygoneTalesTheLongMarch from '!!raw-loader!./challenges/bygone-tales/the-long-march.xml';
import challengesBygoneTalesTheShepherds from '!!raw-loader!./challenges/bygone-tales/the-shepherds.xml';
import challengesCreativeModeMetalAge from '!!raw-loader!./challenges/creative-mode/metal-age.xml';
import challengesCreativeModeStoneAge from '!!raw-loader!./challenges/creative-mode/stone-age.xml';

// parsers
import {xmlToReduxJson} from '~/data/scenario/loader';

export const presets = {
  // Freeplay
  'freeplay/ancient_warriors': freeplayAncientWarriors,
  'freeplay/continental_dawn': freeplayContinentalDawn,
  'freeplay/the_northlands': freeplayTheNorthlands,

  // Challenges
  'challenges/bygone_tales/before_dawn': challengesBygoneTalesBeforeDawn,
  'challenges/bygone_tales/temple_of_the_sun': challengesBygoneTalesTempleOfTheSun,
  'challenges/bygone_tales/the_long_march': challengesBygoneTalesTheLongMarch,
  'challenges/bygone_tales/the_shepherds': challengesBygoneTalesTheShepherds,
  'challenges/creative_mode/metal_age': challengesCreativeModeMetalAge,
  'challenges/creative_mode/stone_age': challengesCreativeModeStoneAge,
};

export type ScenarioName = keyof typeof presets;

/** Scenario presets */
export const presetOptions = [{
  label: 'Freeplay',
  options: [{
    label: 'Ancient Warriors',
    value: 'freeplay/ancient_warriors',
    type: 'scenario',
  }, {
    label: 'Continental Dawn',
    value: 'freeplay/continental_dawn',
    type: 'scenario',
  }, {
    label: 'The Northlands',
    value: 'freeplay/the_northlands',
    type: 'scenario',
  }],
}, {
  label: 'Bygone Tales (Challenges)',
  options: [{
    label: 'Before Dawn',
    value: 'challenges/bygone_tales/before_dawn',
    type: 'scenario',
  }, {
    label: 'Temple of the Sun',
    value: 'challenges/bygone_tales/temple_of_the_sun',
    type: 'scenario',
  }, {
    label: 'The Long March',
    value: 'challenges/bygone_tales/the_long_march',
    type: 'scenario',
  }, {
    label: 'The Shepherds',
    value: 'challenges/bygone_tales/the_shepherds',
    type: 'scenario',
  }],
}, {
  label: 'Creative mode (Challenges)',
  options: [{
    label: 'Metal Age',
    value: 'challenges/creative_mode/metal_age',
    type: 'scenario',
  }, {
    label: 'Stone Age',
    value: 'challenges/creative_mode/stone_age',
    type: 'scenario',
  }],
}];

export const presetsXmlToJson = (name: ScenarioName) => {
  return xmlToReduxJson(presets[name]);
};
