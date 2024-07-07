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
export const presetsList: { label: string, value: string, group: string }[] = [{
  label: 'Ancient Warriors',
  value: 'freeplay/ancient_warriors',
  group: 'Freeplay',
}, {
  label: 'Continental Dawn',
  value: 'freeplay/continental_dawn',
  group: 'Freeplay',
}, {
  label: 'The Northlands',
  value: 'freeplay/the_northlands',
  group: 'Freeplay',
}, {
  label: 'Before Dawn',
  value: 'challenges/bygone_tales/before_dawn',
  group: 'Challenges / Bygone Tales',
}, {
  label: 'Temple of the Sun',
  value: 'challenges/bygone_tales/temple_of_the_sun',
  group: 'Challenges / Bygone Tales',
}, {
  label: 'The Long March',
  value: 'challenges/bygone_tales/the_long_march',
  group: 'Challenges / Bygone Tales',
}, {
  label: 'The Shepherds',
  value: 'challenges/bygone_tales/the_shepherds',
  group: 'Challenges / Bygone Tales',
}, {
  label: 'Meta Age',
  value: 'challenges/creative_mode/meta_age',
  group: 'Challenges / Creative Mode',
}, {
  label: 'Stone Age',
  value: 'challenges/creative_mode/stone_age',
  group: 'Challenges / Creative Mode',
}];

export const presetsXmlToJson = (name: ScenarioName) => {
  return xmlToReduxJson(presets[name]);
};
